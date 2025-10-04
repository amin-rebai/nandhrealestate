import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: 'sale' | 'rent';
  status: 'available' | 'sold' | 'rented';
  features: string[];
  agent: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Property location is required'],
    trim: true
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
  images: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: [true, 'Property type is required']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented'],
    default: 'available'
  },
  features: [{
    type: String,
    trim: true
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
