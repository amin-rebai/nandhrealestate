import mongoose, { Document, Schema } from 'mongoose';

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
  type: 'sale' | 'rent' | 'off-plan';
  status: 'available' | 'sold' | 'rented';
  features: {
    en: string[];
    ar: string[];
  };
  agent: mongoose.Types.ObjectId;
  verified: boolean;
  completionDate?: string;
  paymentPlan?: string;
  propertyType: string;
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
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Apartment', 'Villa', 'Penthouse', 'Studio', 'Townhouse', 'Office', 'Shop'],
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

export default mongoose.model<IProperty>('Property', PropertySchema);
