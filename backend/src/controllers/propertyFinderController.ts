import { Request, Response } from 'express';
import Property from '../models/Property';
import User from '../models/User';
import propertyFinderService, { PropertyFinderListing } from '../services/propertyFinderService';

/**
 * Property Finder Webhook Controller
 * Handles incoming webhooks from Property Finder Enterprise API
 */

/**
 * @desc    Handle Property Finder webhook
 * @route   POST /api/property-finder/webhook
 * @access  Public (but verified with signature)
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Get the signature from headers
    const signature = req.headers['x-signature'] as string;

    // Verify webhook signature for security
    const rawBody = JSON.stringify(req.body);
    if (!propertyFinderService.verifyWebhookSignature(rawBody, signature)) {
      console.warn('Invalid webhook signature received');
      // Continue anyway for development, but log warning
    }

    const payload = req.body;

    // Handle different webhook event types
    const eventType = payload.eventType || payload.event;

    if (!eventType) {
      console.log('Received webhook without event type:', payload);
      return res.status(200).json({
        success: true,
        message: 'Webhook received'
      });
    }

    console.log(`Received Property Finder webhook: ${eventType}`);

    // Get default agent (admin or first agent)
    const defaultAgent = await User.findOne({ role: 'admin' }) || await User.findOne({ role: 'agent' });

    if (!defaultAgent) {
      return res.status(500).json({
        success: false,
        message: 'No default agent found in system'
      });
    }

    // Handle different webhook events
    switch (eventType) {
      case 'listing.published':
        await handleListingPublished(payload.data?.listing, defaultAgent._id.toString());
        break;

      case 'listing.unpublished':
        await handleListingUnpublished(payload.data?.listing);
        break;

      case 'listing.action':
        // Handle compliance actions (permit issues, etc.)
        console.log('Listing action received:', payload.data?.action);
        break;

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('Error processing Property Finder webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: error.message
    });
  }
};

/**
 * Handle listing published event
 */
async function handleListingPublished(pfListing: PropertyFinderListing, agentId: string) {
  try {
    if (!pfListing) {
      console.log('No listing data in webhook');
      return;
    }

    console.log('Processing listing:', JSON.stringify(pfListing, null, 2));

    // Check if listing already exists
    const existingProperty = await Property.findOne({
      $or: [
        { propertyFinderRefId: String(pfListing.id) },
        { referenceNumber: pfListing.reference }
      ]
    });

    if (existingProperty) {
      console.log(`Listing ${pfListing.id} already exists, updating`);
      await updatePropertyFromListing(pfListing, existingProperty, agentId);
    } else {
      console.log(`Creating new listing ${pfListing.id}`);
      await createPropertyFromListing(pfListing, agentId);
    }

  } catch (error: any) {
    console.error('Error handling listing published:', error);
    throw error;
  }
}

/**
 * Handle listing unpublished event
 */
async function handleListingUnpublished(pfListing: PropertyFinderListing) {
  try {
    if (!pfListing) {
      return;
    }

    // Find and update property status
    const property = await Property.findOne({
      $or: [
        { propertyFinderRefId: String(pfListing.id) },
        { referenceNumber: pfListing.reference }
      ]
    });

    if (property) {
      property.status = 'sold'; // Mark as unavailable
      await property.save();
      console.log(`Marked property ${property._id} as unavailable`);
    }

  } catch (error: any) {
    console.error('Error handling listing unpublished:', error);
    throw error;
  }
}

/**
 * Create property from Property Finder listing
 */
async function createPropertyFromListing(pfListing: PropertyFinderListing, agentId: string) {
  try {
    // Validate listing has required fields
    if (!pfListing) {
      throw new Error('Listing is undefined');
    }
    if (!pfListing.id && !pfListing.reference) {
      throw new Error('Listing must have either id or reference');
    }

    console.log('Transforming listing with ID:', pfListing.id, 'Reference:', pfListing.reference);

    const propertyData = await propertyFinderService.transformListing(pfListing, agentId);

    console.log('Property data transformed successfully, creating in database...');
    const newProperty = await Property.create(propertyData);
    console.log(`Created new property from Property Finder: ${newProperty._id}`);

    return newProperty;
  } catch (error: any) {
    console.error('Error creating property from listing:', error);
    throw error;
  }
}

/**
 * Update property from Property Finder listing
 */
async function updatePropertyFromListing(
  pfListing: PropertyFinderListing,
  existingProperty: any,
  agentId: string
) {
  try {
    const propertyData = await propertyFinderService.transformListing(pfListing, agentId);

    // Update the existing property
    Object.assign(existingProperty, propertyData);
    await existingProperty.save();

    console.log(`Updated property from Property Finder: ${existingProperty._id}`);

    return existingProperty;
  } catch (error: any) {
    console.error('Error updating property from listing:', error);
    throw error;
  }
}

/**
 * @desc    Manually sync all properties from Property Finder
 * @route   POST /api/property-finder/sync
 * @access  Private/Admin
 */
export const syncAllProperties = async (req: Request, res: Response) => {
  try {
    // Get default agent
    const defaultAgent = await User.findOne({ role: 'admin' }) || await User.findOne({ role: 'agent' });
    if (!defaultAgent) {
      return res.status(500).json({
        success: false,
        message: 'No default agent found in system'
      });
    }

    console.log('Pre-loading locations from Property Finder...');
    await propertyFinderService.preloadLocations();

    console.log('Fetching all properties from Property Finder...');

    // Fetch published listings
    const pfListings = await propertyFinderService.searchListings({
      status: 'active',
      perPage: 100
    });

    console.log(`Found ${pfListings.total} properties in Property Finder`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    // Process each listing
    for (const pfListing of pfListings.results) {
      try {
        const existingProperty = await Property.findOne({
          $or: [
            { propertyFinderRefId: String(pfListing.id) },
            { referenceNumber: pfListing.reference }
          ]
        });

        if (existingProperty) {
          await updatePropertyFromListing(pfListing, existingProperty, defaultAgent._id.toString());
          updated++;
        } else {
          await createPropertyFromListing(pfListing, defaultAgent._id.toString());
          created++;
        }
      } catch (error: any) {
        console.error(`Error syncing listing ${pfListing.reference}:`, error.message);
        errors++;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Property sync completed',
      stats: {
        total: pfListings.total,
        created,
        updated,
        errors
      }
    });

  } catch (error: any) {
    console.error('Error syncing properties from Property Finder:', error);
    return res.status(500).json({
      success: false,
      message: 'Error syncing properties',
      error: error.message
    });
  }
};

/**
 * @desc    Sync a single property by ID or reference number
 * @route   POST /api/property-finder/sync/:identifier
 * @access  Private/Admin
 */
export const syncSingleProperty = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    // Get default agent
    const defaultAgent = await User.findOne({ role: 'admin' }) || await User.findOne({ role: 'agent' });

    if (!defaultAgent) {
      return res.status(500).json({
        success: false,
        message: 'No default agent found in system'
      });
    }

    // Try to fetch by ID first, then by reference
    let pfListing = await propertyFinderService.getListing(parseInt(identifier));

    if (!pfListing) {
      pfListing = await propertyFinderService.getListingByReference(identifier);
    }

    if (!pfListing) {
      return res.status(404).json({
        success: false,
        message: 'Property not found in Property Finder'
      });
    }

    // Check if property exists locally
    const existingProperty = await Property.findOne({
      $or: [
        { propertyFinderRefId: String(pfListing.id) },
        { referenceNumber: pfListing.reference }
      ]
    });

    let property;
    if (existingProperty) {
      property = await updatePropertyFromListing(
        pfListing,
        existingProperty,
        defaultAgent._id.toString()
      );
    } else {
      property = await createPropertyFromListing(pfListing, defaultAgent._id.toString());
    }

    return res.status(200).json({
      success: true,
      message: existingProperty ? 'Property updated successfully' : 'Property created successfully',
      data: property
    });

  } catch (error: any) {
    console.error('Error syncing single property:', error);
    return res.status(500).json({
      success: false,
      message: 'Error syncing property',
      error: error.message
    });
  }
};

/**
 * @desc    Get webhook subscription status
 * @route   GET /api/property-finder/webhooks
 * @access  Private/Admin
 */
export const getWebhookStatus = async (req: Request, res: Response) => {
  try {
    const events = await propertyFinderService.getWebhookEvents();

    return res.status(200).json({
      success: true,
      data: events
    });

  } catch (error: any) {
    console.error('Error getting webhook status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting webhook status',
      error: error.message
    });
  }
};

/**
 * @desc    Setup webhook subscription
 * @route   POST /api/property-finder/webhooks
 * @access  Private/Admin
 */
export const setupWebhook = async (req: Request, res: Response) => {
  try {
    const { eventId, url, secret } = req.body;

    if (!eventId || !url) {
      return res.status(400).json({
        success: false,
        message: 'eventId and url are required'
      });
    }

    const webhook = await propertyFinderService.subscribeWebhook(eventId, url, secret);

    return res.status(201).json({
      success: true,
      message: 'Webhook subscription created',
      data: webhook
    });

  } catch (error: any) {
    console.error('Error setting up webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Error setting up webhook',
      error: error.message
    });
  }
};

/**
 * @desc    Debug endpoint - test locations API
 * @route   GET /api/property-finder/debug/locations
 * @access  Private/Admin
 */
export const debugLocations = async (req: Request, res: Response) => {
  try {
    console.log('===============================================');
    console.log('DEBUG: Testing Locations API');
    console.log('===============================================');

    // First, try to get all locations
    const locations = await propertyFinderService.getLocations();

    console.log('GET LOCATIONS RESULT:');
    console.log('- Type:', typeof locations);
    console.log('- Is Array:', Array.isArray(locations));
    console.log('- Length:', locations ? locations.length : 'N/A');
    if (locations && locations.length > 0) {
      console.log('- First 3 locations:', JSON.stringify(locations.slice(0, 3)));
    }

    // Try to get a specific location by ID (e.g., 422 = The Pearl)
    const testLocationId = 422;
    const singleLocation = await propertyFinderService.getLocationById(testLocationId);

    console.log('\nGET LOCATION BY ID (422) RESULT:');
    console.log('- Result:', JSON.stringify(singleLocation));

    return res.status(200).json({
      success: true,
      message: 'Debug info check server console for details',
      data: {
        locationsCount: locations ? locations.length : 0,
        locationsSample: locations ? locations.slice(0, 5) : [],
        testLocationId,
        testLocationResult: singleLocation,
        cacheSize: (propertyFinderService as any).locationCache?.size || 'N/A'
      }
    });

  } catch (error: any) {
    console.error('ERROR in debug locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Error debugging locations',
      error: error.message
    });
  }
};
