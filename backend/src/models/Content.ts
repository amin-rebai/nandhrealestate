import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  section: 'home' | 'hero' | 'about' | 'featured' | 'services' | 'goals' | 'clients' | 'vision' | 'mission' | 'values' | 'slider' | 'portfolio' | 'contact';
  title: {
    en: string;
    ar: string;
    fr?: string;
  };
  subtitle?: {
    en?: string;
    ar?: string;
    fr?: string;
  };
  content?: {
    en?: string;
    ar?: string;
    fr?: string;
  };
  description?: {
    en?: string;
    ar?: string;
    fr?: string;
  };
  image?: string;
  backgroundImage?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  ctaText?: {
    en?: string;
    ar?: string;
    fr?: string;
  };
  ctaLink?: string;
  propertyType?: 'villa' | 'apartment' | 'penthouse' | 'commercial' | 'office' | 'retail';
  isActive: boolean;
  order?: number;
  stats?: Array<{
    label: {
      en: string;
      ar: string;
      fr?: string;
    };
    value: string;
  }>;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema({
  section: {
    type: String,
    required: [true, 'Section type is required'],
    enum: ['home', 'hero', 'about', 'featured', 'services', 'goals', 'clients', 'vision', 'mission', 'values', 'slider', 'portfolio', 'contact'],
    index: true
  },
  title: {
    en: {
      type: String,
      required: [true, 'English title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    ar: {
      type: String,
      required: [true, 'Arabic title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    fr: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    }
  },
  subtitle: {
    en: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters']
    },
    ar: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters']
    },
    fr: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters']
    }
  },
  content: {
    en: {
      type: String,
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    ar: {
      type: String,
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    fr: {
      type: String,
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters']
    }
  },
  description: {
    en: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    ar: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    fr: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    }
  },
  image: {
    type: String,
    trim: true
  },
  backgroundImage: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  ctaText: {
    en: {
      type: String,
      trim: true,
      maxlength: [50, 'CTA text cannot exceed 50 characters']
    },
    ar: {
      type: String,
      trim: true,
      maxlength: [50, 'CTA text cannot exceed 50 characters']
    },
    fr: {
      type: String,
      trim: true,
      maxlength: [50, 'CTA text cannot exceed 50 characters']
    }
  },
  ctaLink: {
    type: String,
    trim: true
  },
  propertyType: {
    type: String,
    enum: ['villa', 'apartment', 'penthouse', 'commercial', 'office', 'retail'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  stats: [{
    label: {
      en: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Stat label cannot exceed 50 characters']
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Stat label cannot exceed 50 characters']
      },
      fr: {
        type: String,
        trim: true,
        maxlength: [50, 'Stat label cannot exceed 50 characters']
      }
    },
    value: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, 'Stat value cannot exceed 20 characters']
    }
  }],
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
ContentSchema.index({ section: 1, isActive: 1, order: 1 });

// Ensure only one active hero section at a time
ContentSchema.pre('save', async function (next) {
  if (this.section === 'hero' && this.isActive) {
    // Deactivate other hero sections
    await mongoose.model('Content').updateMany(
      { section: 'hero', _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

// Ensure only one active home section at a time
ContentSchema.pre('save', async function (next) {
  if (this.section === 'home' && this.isActive) {
    await mongoose.model('Content').updateMany(
      { section: 'home', _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

// Ensure only one active about section at a time
ContentSchema.pre('save', async function (next) {
  if (this.section === 'about' && this.isActive) {
    // Deactivate other about sections
    await mongoose.model('Content').updateMany(
      { section: 'about', _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.model<IContent>('Content', ContentSchema);
