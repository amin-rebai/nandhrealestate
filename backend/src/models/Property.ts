import mongoose, { Document, Schema } from 'mongoose';

// Property type categories
export type PropertyCategory = 'residential' | 'commercial' | 'industrial' | 'land';

// Expanded property types based on FGRealty
export type PropertyType =
  // Residential
  | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio' | 'Townhouse' | 'Duplex'
  | 'Hotel Apartment' | 'Chalet' | 'Compound Villa' | 'Standalone Villa'
  // Commercial
  | 'Office' | 'Shop' | 'Showroom' | 'Retail Shop' | 'Commercial Villa'
  | 'Restaurant' | 'Whole Building' | 'Hotel'
  // Industrial
  | 'Warehouse' | 'Factory' | 'Labor Camp' | 'Industrial Land'
  // Land
  | 'Land' | 'Land Plot' | 'Residential Land' | 'Commercial Land';

export interface IProperty extends Document {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price: number;
  currency: 'QAR' | 'USD' | 'EUR' | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR';
  location: {
    en: string;
    ar: string;
  };
  country: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  images: string[];
  video?: string;
  type: 'sale' | 'rent' | 'off-plan';
  status: 'available' | 'sold' | 'rented';
  features: {
    en: string[];
    ar: string[];
  };
  agent: mongoose.Types.ObjectId;
  verified: boolean;
  featured: boolean;
  featuredInPortfolio: boolean;
  // Property classification
  category: PropertyCategory;
  propertyType: PropertyType;
  // Off-plan specific fields
  completionDate?: string;
  paymentPlan?: string;
  developer?: string;
  projectName?: string;
  handoverDate?: string;
  startingPrice?: number;
  downPayment?: string;
  installmentPlan?: string;
  // Additional property fields (FGRealty-style)
  referenceNumber?: string;
  serviceCharge?: number;
  transferFee?: string;
  titleDeed?: boolean;
  tenanted?: boolean;
  availableFrom?: string;
  propertyBrochure?: string;
  layoutImage?: string;
  roi?: string;
  guaranteedReturns?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema({
  title: {
    en: {
      type: String,
      required: [true, 'English property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    }
  },
  description: {
    en: {
      type: String,
      required: [true, 'English property description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic property description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['QAR', 'USD', 'EUR', 'AED', 'SAR', 'KWD', 'BHD', 'OMR'],
    default: 'QAR',
    required: [true, 'Currency is required']
  },
  location: {
    en: {
      type: String,
      required: [true, 'English property location is required'],
      trim: true
    },
    ar: {
      type: String,
      required: [true, 'Arabic property location is required'],
      trim: true
    }
  },
  country: {
    type: String,
    required: [true, 'Property country is required'],
    default: 'Qatar'
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Property area is required'],
    min: [0, 'Area cannot be negative']
  },
  yearBuilt: {
    type: Number,
    required: [true, 'Year built is required'],
    min: [1900, 'Year built cannot be before 1900'],
    max: [new Date().getFullYear() + 5, 'Year built cannot be more than 5 years in the future']
  },
  images: [{
    type: String,
    required: true
  }],
  video: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['sale', 'rent', 'off-plan'],
    required: [true, 'Property type is required']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented'],
    default: 'available'
  },
  features: {
    en: [{
      type: String,
      trim: true
    }],
    ar: [{
      type: String,
      trim: true
    }]
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  featuredInPortfolio: {
    type: Boolean,
    default: false,
    index: true
  },
  completionDate: {
    type: String,
    required: function (this: IProperty) {
      return this.type === 'off-plan';
    }
  },
  paymentPlan: {
    type: String,
    required: function (this: IProperty) {
      return this.type === 'off-plan';
    }
  },
  developer: {
    type: String,
    trim: true
  },
  projectName: {
    type: String,
    trim: true
  },
  handoverDate: {
    type: String,
    trim: true
  },
  startingPrice: {
    type: Number,
    min: [0, 'Starting price cannot be negative']
  },
  downPayment: {
    type: String,
    trim: true
  },
  installmentPlan: {
    type: String,
    trim: true
  },
  // Additional property fields (FGRealty-style)
  referenceNumber: {
    type: String,
    trim: true
  },
  serviceCharge: {
    type: Number,
    min: [0, 'Service charge cannot be negative']
  },
  transferFee: {
    type: String,
    trim: true
  },
  titleDeed: {
    type: Boolean,
    default: false
  },
  tenanted: {
    type: Boolean,
    default: false
  },
  availableFrom: {
    type: String,
    trim: true
  },
  propertyBrochure: {
    type: String,
    trim: true
  },
  layoutImage: {
    type: String,
    trim: true
  },
  roi: {
    type: String,
    trim: true
  },
  guaranteedReturns: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'land'],
    default: 'residential',
    required: [true, 'Property category is required']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: [
      // Residential
      'Apartment', 'Villa', 'Penthouse', 'Studio', 'Townhouse', 'Duplex',
      'Hotel Apartment', 'Chalet', 'Compound Villa', 'Standalone Villa',
      // Commercial
      'Office', 'Shop', 'Showroom', 'Retail Shop', 'Commercial Villa',
      'Restaurant', 'Whole Building', 'Hotel',
      // Industrial
      'Warehouse', 'Factory', 'Labor Camp', 'Industrial Land',
      // Land
      'Land', 'Land Plot', 'Residential Land', 'Commercial Land'
    ],
    default: 'Apartment'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PropertySchema.index({ location: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ category: 1 });
PropertySchema.index({ propertyType: 1 });

export default mongoose.model<IProperty>('Property', PropertySchema);
