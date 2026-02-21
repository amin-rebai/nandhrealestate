import axios, { AxiosInstance } from 'axios';

/**
 * Property Finder Enterprise API Service
 * Documentation: https://api-docs.propertyfinder.net/enterprise-api/index.html
 */

interface PropertyFinderConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

interface PropertyFinderLocation {
  id: number;
  name: string;
  nameArabic?: string;
  parentId?: number;
  level?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface PropertyFinderListing {
  id: string;
  reference: string;
  title: { en: string; ar?: string };
  description: { en: string; ar?: string };
  type: string;
  category: string;
  price: {
    amounts: {
      monthly?: number;
      sale?: number;
      yearly?: number;
      weekly?: number;
      daily?: number;
    };
    type: 'monthly' | 'sale' | 'yearly' | 'weekly' | 'daily';
    downpayment?: number;
    numberOfMortgageYears?: number;
    paymentMethods?: string[];
  };
  bedrooms: string | number;
  bathrooms: string | number;
  size: number;
  location: {
    id: number;
  };
  media: {
    images?: Array<{
      original: {
        url: string;
        width: number;
        height: number;
      };
      watermarked: {
        url: string;
      };
    }>;
    videos?: Array<{
      url: string;
    }>;
  };
  amenities?: string[];
  furnishingType: 'furnished' | 'unfurnished' | 'semi-furnished';
  state: {
    stage: string;
    type: string;
  };
  assignedTo?: {
    id: number;
    name: string;
  };
  createdBy?: {
    id: number;
    name: string;
  };
  updatedBy?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  availableFrom?: string;
  parkingSlots?: number;
  projectStatus?: string;
  developer?: string;
  portals?: {
    propertyfinder?: {
      isLive: boolean;
      publishedAt: string;
    };
  };
  products?: {
    standard?: any;
    featured?: any;
  };
  qualityScore?: {
    value: number;
    color: string;
  };
}

interface PropertyFinderWebhookEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  data: {
    listing: PropertyFinderListing;
  };
}

class PropertyFinderService {
  private config: PropertyFinderConfig;
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private locationCache: Map<number, PropertyFinderLocation> = new Map();

  constructor() {
    this.config = {
      apiKey: process.env.PROPERTY_FINDER_API_KEY || 'qzXXB.NMEqzeyIfvmWgY529gAKVNApEGWxZgH1kA',
      apiSecret: process.env.PROPERTY_FINDER_API_SECRET || 'mzwDdPLPpWGNuKsvM6OkGHE6596JZBK4',
      baseUrl: process.env.PROPERTY_FINDER_API_URL || 'https://atlas.propertyfinder.com'
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30000
    });
  }

  /**
   * Get OAuth 2.0 access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {

      const response = await this.axiosInstance.post<TokenResponse>('/v1/auth/token', {
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      this.accessToken = response.data.accessToken;
      // Set expiry 1 minute before actual expiry to be safe
      this.tokenExpiry = Date.now() + (response.data.expiresIn - 60) * 1000;

      return this.accessToken;
    } catch (error: any) {
      console.error('Error getting Property Finder access token:', error.message);
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  /**
   * Make authenticated API request
   */
  private async authenticatedRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<T> {
    const token = await this.getAccessToken();

    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url: endpoint,
        data,
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, clear and retry once
        this.accessToken = null;
        this.tokenExpiry = 0;

        const token = await this.getAccessToken();

        const response = await this.axiosInstance.request<T>({
          method,
          url: endpoint,
          data,
          params,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        return response.data;
      }

      console.error(`Property Finder API error (${method} ${endpoint}):`, error.message);
      throw error;
    }
  }

  /**
   * Verify webhook signature for security
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const secret = process.env.PROPERTY_FINDER_WEBHOOK_SECRET || '';

    if (!secret || !signature) {
      console.warn('Webhook secret not configured, skipping signature verification');
      return true; // Skip verification if no secret configured
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Get locations from Property Finder
   */
  async getLocations(search?: string, parentId?: number): Promise<PropertyFinderLocation[]> {
    try {
      const params: any = {};
      if (search) params['filter[name]'] = search;
      if (parentId) params['filter[parent]'] = parentId;

      const response = await this.authenticatedRequest<{ data: PropertyFinderLocation[] }>(
        'get',
        '/v1/locations',
        undefined,
        params
      );

      // Cache all locations
      if (response.data) {
        response.data.forEach(loc => {
          this.locationCache.set(loc.id, loc);
        });
      }

      return response.data || [];
    } catch (error: any) {
      console.error('Error fetching locations from Property Finder:', error.message);
      return [];
    }
  }

  /**
   * Get a single location by ID
   */
  async getLocationById(locationId: number): Promise<PropertyFinderLocation | null> {
    // Check cache first
    if (this.locationCache.has(locationId)) {
      return this.locationCache.get(locationId)!;
    }

    try {
      console.log(`[PF] Trying to fetch location ${locationId} from API using search...`);

      // Use search query to find location by ID
      const response = await this.authenticatedRequest<{ data: PropertyFinderLocation[] }>(
        'get',
        '/v1/locations',
        undefined,
        { search: locationId.toString(), perPage: 10 }
      );

      if (response && response.data && response.data.length > 0) {
        // Find the exact match
        const found = response.data.find(loc => loc.id === locationId);
        if (found) {
          console.log(`[PF] Found location ${locationId}: ${found.name}`);
          this.locationCache.set(locationId, found);
          return found;
        }
      }

      console.log(`[PF] Could not find location ${locationId} via search`);
      return null;
    } catch (error: any) {
      console.error(`Error fetching location ${locationId} from Property Finder:`, error.message);
      return null;
    }
  }

  /**
   * Pre-load locations cache for better performance
   */
  async preloadLocations(): Promise<void> {
    try {
      console.log('===============================================');
      console.log('PRE-LOADING LOCATIONS FROM PROPERTY FINDER');
      console.log('===============================================');

      // Fetch all locations with higher perPage
      const response = await this.authenticatedRequest<{ data: PropertyFinderLocation[] }>(
        'get',
        '/v1/locations',
        undefined,
        { perPage: 1000 }
      );

      console.log('Locations API response type:', typeof response);
      console.log('Response structure:', response ? Object.keys(response) : 'null');

      const allLocations: PropertyFinderLocation[] = [];

      if (response && response.data && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} locations in API response`);
        response.data.forEach(loc => {
          this.locationCache.set(loc.id, loc);
          allLocations.push(loc);
        });
      } else if (response && Array.isArray(response)) {
        console.log('Response is an array with', response.length, 'items');
        response.forEach((loc: PropertyFinderLocation) => {
          this.locationCache.set(loc.id, loc);
          allLocations.push(loc);
        });
      }

      console.log(`\n==============================================`);
      console.log(`PRELOAD COMPLETE: ${allLocations.length} locations loaded`);
      console.log(`==============================================`);

      // Show some sample locations
      if (allLocations.length > 0) {
        console.log('Sample locations loaded:');
        allLocations.slice(0, 10).forEach(loc => {
          console.log(`  - ID: ${loc.id}, Name: ${loc.name}`);
        });

        // Check if our property locations exist
        const testIds = [422, 1607, 1532, 130, 265, 345, 415, 443, 1507];
        console.log('\nChecking if property location IDs are in cache:');
        testIds.forEach(id => {
          const exists = this.locationCache.has(id);
          const loc = this.locationCache.get(id);
          console.log(`  ID ${id}: ${exists ? 'FOUND - ' + loc?.name : 'NOT FOUND'}`);
        });
      }
    } catch (error: any) {
      console.error('ERROR pre-loading locations:', error.message);
      console.error(error.stack);
    }
  }

  /**
   * Search listings from Property Finder
   */
  async searchListings(params?: {
    page?: number;
    perPage?: number;
    status?: string;
    locationId?: number;
  }): Promise<{ results: PropertyFinderListing[]; total: number }> {
    try {
      const queryParams: any = {
        page: params?.page || 1,
        perPage: params?.perPage || 50
      };

      if (params?.status) {
        queryParams['filter[status]'] = params.status;
      }
      if (params?.locationId) {
        queryParams['filter[locationId]'] = params.locationId;
      }

      // The API returns { pagination: { total, page, perPage, ... }, results: [...] }
      const response = await this.authenticatedRequest<{
        results: PropertyFinderListing[];
        pagination: {
          total: number;
          page: number;
          perPage: number;
          totalPages: number;
          nextPage: number | null;
          prevPage: number | null;
        };
      }>('get', '/v1/listings', undefined, queryParams);

      return {
        results: response.results || [],
        total: response.pagination?.total || 0
      };
    } catch (error: any) {
      console.error('Error fetching listings from Property Finder:', error.message);
      return { results: [], total: 0 };
    }
  }

  /**
   * Get a single listing by ID
   */
  async getListing(listingId: number): Promise<PropertyFinderListing | null> {
    try {
      const response = await this.authenticatedRequest<PropertyFinderListing>(
        'get',
        `/v1/listings/${listingId}`
      );

      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching listing from Property Finder:', error.message);
      throw error;
    }
  }

  /**
   * Get a listing by reference number
   */
  async getListingByReference(reference: string): Promise<PropertyFinderListing | null> {
    try {
      const response = await this.authenticatedRequest<{
        results: PropertyFinderListing[];
      }>('get', '/v1/listings', undefined, {
        'filter[reference]': reference,
        perPage: 1
      });

      return response.results && response.results.length > 0 ? response.results[0] : null;
    } catch (error: any) {
      console.error('Error fetching listing by reference:', error.message);
      return null;
    }
  }

  /**
   * Map Property Finder property type to local property type
   */
  mapPropertyType(pfType: string | undefined): string {
    if (!pfType) {
      return 'Apartment';
    }

    const typeMapping: { [key: string]: string } = {
      'apartment': 'Apartment',
      'villa': 'Villa',
      'townhouse': 'Townhouse',
      'penthouse': 'Penthouse',
      'duplex': 'Duplex',
      'studio': 'Studio',
      'hotel-apartment': 'Hotel Apartment',
      'bungalow': 'Standalone Villa',
      'compound': 'Compound Villa',
      'whole-building': 'Whole Building',
      'office-space': 'Office',
      'shop': 'Shop',
      'show-room': 'Showroom',
      'retail': 'Retail Shop',
      'warehouse': 'Warehouse',
      'factory': 'Factory',
      'labor-camp': 'Labor Camp',
      'land': 'Land',
      'farm': 'Land',
      'full-floor': 'Apartment',
      'half-floor': 'Apartment'
    };

    const normalizedType = pfType.toLowerCase();
    return typeMapping[normalizedType] || 'Apartment';
  }

  /**
   * Map Property Finder listing type to local type
   */
  mapListingType(listingType: string | undefined): 'sale' | 'rent' | 'off-plan' {
    if (listingType === 'sale') {
      return 'sale';
    }
    return 'rent';
  }

  /**
   * Map Property Finder category
   */
  mapCategory(propertyType: string | undefined): 'residential' | 'commercial' | 'industrial' | 'land' {
    if (!propertyType) {
      return 'residential';
    }

    const residentialTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'duplex',
      'studio', 'hotel-apartment', 'bungalow', 'compound', 'whole-building',
      'full-floor', 'half-floor'];
    const commercialTypes = ['office-space', 'shop', 'show-room', 'retail',
      'warehouse', 'factory', 'labor-camp', 'bulk-rent-unit', 'bulk-sale-unit'];
    const landTypes = ['land', 'farm'];

    const normalizedType = propertyType.toLowerCase();

    if (landTypes.includes(normalizedType)) {
      return 'land';
    }
    if (commercialTypes.includes(normalizedType)) {
      return 'commercial';
    }
    if (residentialTypes.includes(normalizedType)) {
      return 'residential';
    }

    return 'residential';
  }

  /**
   * Map Property Finder currency to local currency
   */
  mapCurrency(currency: string | undefined): 'QAR' | 'USD' | 'EUR' | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR' {
    const currencyMap: { [key: string]: string } = {
      'AED': 'AED',
      'USD': 'USD',
      'EUR': 'EUR',
      'QAR': 'QAR',
      'SAR': 'SAR',
      'KWD': 'KWD',
      'BHD': 'BHD',
      'OMR': 'OMR'
    };

    const normalizedCurrency = currency?.toUpperCase() || 'AED';
    return (currencyMap[normalizedCurrency] || 'AED') as any;
  }

  /**
   * Transform Property Finder listing to local property format
   */
  async transformListing(pfListing: PropertyFinderListing, defaultAgentId: string): Promise<any> {
    try {
      // Extract images from media object
      const images = pfListing.media?.images?.map(img => img.original?.url).filter(Boolean) || [];

      // Extract video URL if available
      const video = pfListing.media?.videos?.[0]?.url;

      // Get price and listing type from price object
      const priceAmounts = pfListing.price?.amounts || {};
      const priceType = pfListing.price?.type || 'monthly';

      // Get the appropriate price (prefer sale if available, otherwise monthly)
      let price = priceAmounts.sale || priceAmounts.monthly || priceAmounts.yearly || priceAmounts.weekly || priceAmounts.daily || 0;

      // Determine listing type (sale or rent)
      const listingType: 'sale' | 'rent' = priceType === 'sale' ? 'sale' : 'rent';

      // Handle bedrooms - can be "studio" or a number string
      let bedrooms = 0;
      if (pfListing.bedrooms === 'studio') {
        bedrooms = 0; // Studio is 0 bedrooms
      } else if (typeof pfListing.bedrooms === 'string') {
        bedrooms = parseInt(pfListing.bedrooms, 10) || 0;
      } else if (typeof pfListing.bedrooms === 'number') {
        bedrooms = pfListing.bedrooms;
      }

      // Handle bathrooms
      let bathrooms = 0;
      if (typeof pfListing.bathrooms === 'string') {
        bathrooms = parseInt(pfListing.bathrooms, 10) || 0;
      } else if (typeof pfListing.bathrooms === 'number') {
        bathrooms = pfListing.bathrooms;
      }

      // Build location string - try to get actual location name from cache or API
      const locationId = pfListing.location?.id || 0;
      let locationEn = `Location ID: ${locationId}`;
      let locationAr = `الموقع: ${locationId}`;

      console.log(`[PF] Listing ${pfListing.reference}: locationId=${locationId}, cacheSize=${this.locationCache.size}, hasInCache=${this.locationCache.has(locationId)}`);

      if (locationId) {
        // Try to get location from cache first
        let location = this.locationCache.get(locationId);

        // If not in cache, try to fetch it
        if (!location) {
          console.log(`[PF] Fetching location ${locationId} from API...`);
          const fetchedLocation = await this.getLocationById(locationId);
          console.log(`[PF] API response for location ${locationId}:`, fetchedLocation);
          location = fetchedLocation || undefined;
        }

        if (location) {
          console.log(`[PF] Using location name: ${location.name}`);
          locationEn = location.name || locationEn;
          locationAr = location.nameArabic || locationEn;
        } else {
          console.log(`[PF] Location ${locationId} not found`);
        }
      }

      // Determine property status
      const isLive = pfListing.state?.stage === 'live' || pfListing.state?.type === 'live';
      const status = isLive ? 'available' : 'unavailable';

      // Check if featured
      const featured = !!(pfListing.products?.featured);

      // Truncate descriptions to 1000 characters (validation limit)
      const MAX_DESCRIPTION_LENGTH = 5000;

      const truncateText = (text: string, maxLength: number): string => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      };

      return {
        title: {
          en: pfListing.title?.en || `Property in Qatar`,
          ar: pfListing.title?.ar || pfListing.title?.en || `عقار في قطر`
        },
        description: {
          en: truncateText(pfListing.description?.en || '', MAX_DESCRIPTION_LENGTH),
          ar: truncateText(pfListing.description?.ar || pfListing.description?.en || '', MAX_DESCRIPTION_LENGTH)
        },
        price: price,
        currency: 'QAR',
        location: {
          en: locationEn,
          ar: locationEn
        },
        country: 'Qatar',
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        area: pfListing.size || 0,
        images: images,
        video: video,
        type: listingType,
        status: status,
        features: {
          en: pfListing.amenities || [],
          ar: pfListing.amenities || []
        },
        agent: defaultAgentId,
        verified: true,
        featured: featured,
        featuredInPortfolio: false,
        category: this.mapCategory(pfListing.type),
        propertyType: this.mapPropertyType(pfListing.type),
        referenceNumber: pfListing.reference || '',
        propertyFinderRefId: pfListing.id || pfListing.reference,
        propertyFinderReference: pfListing.reference
      };
    } catch (error: any) {
      console.error('Error transforming listing:', error.message);
      throw error;
    }
  }

  /**
   * Process webhook event
   */
  processWebhookEvent(event: PropertyFinderWebhookEvent): {
    action: string;
    listing: PropertyFinderListing;
  } {
    return {
      action: event.eventType,
      listing: event.data.listing
    };
  }

  /**
   * Get available webhook events
   */
  async getWebhookEvents(): Promise<any[]> {
    try {
      const response = await this.authenticatedRequest<any>('get', '/v1/webhooks');
      return response;
    } catch (error: any) {
      console.error('Error fetching webhook events:', error.message);
      return [];
    }
  }

  /**
   * Subscribe to webhook event
   */
  async subscribeWebhook(eventId: string, url: string, secret?: string): Promise<any> {
    try {
      const response = await this.authenticatedRequest<any>('post', '/v1/webhooks', {
        eventId,
        url,
        ...(secret && { secret })
      });

      return response;
    } catch (error: any) {
      console.error('Error subscribing to webhook:', error.message);
      throw error;
    }
  }

  /**
   * Delete webhook subscription
   */
  async deleteWebhook(eventId: number): Promise<void> {
    try {
      await this.authenticatedRequest<void>('delete', `/v1/webhooks/${eventId}`);
    } catch (error: any) {
      console.error('Error deleting webhook:', error.message);
      throw error;
    }
  }
}

export default new PropertyFinderService();
export { PropertyFinderListing, PropertyFinderWebhookEvent, PropertyFinderLocation };
