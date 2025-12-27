import mongoose, { Document, Schema } from 'mongoose';

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// SEO metadata interface
interface SEOMetadata {
  metaTitle: MultilingualText;
  metaDescription: MultilingualText;
  keywords: MultilingualText;
  canonicalUrl?: string;
  ogTitle?: MultilingualText;
  ogDescription?: MultilingualText;
  ogImage?: string;
  tiktokTitle?: MultilingualText;
  tiktokDescription?: MultilingualText;
  tiktokImage?: string;
  structuredData?: any; // JSON-LD structured data
}

// Blog post interface
export interface IBlog extends Document {
  title: MultilingualText;
  slug: MultilingualText;
  excerpt: MultilingualText;
  content: MultilingualText;
  featuredImage: string;
  gallery?: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: MultilingualText;
  };
  category: MultilingualText;
  tags: MultilingualText[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  readingTime?: number; // in minutes
  views: number;
  likes: number;
  seo: SEOMetadata;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Multilingual text schema
const multilingualTextSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true }
}, { _id: false });

// SEO metadata schema
const seoMetadataSchema = new Schema({
  metaTitle: { type: multilingualTextSchema, required: true },
  metaDescription: { type: multilingualTextSchema, required: true },
  keywords: { type: multilingualTextSchema, required: true },
  canonicalUrl: { type: String },
  ogTitle: { type: multilingualTextSchema },
  ogDescription: { type: multilingualTextSchema },
  ogImage: { type: String },
  tiktokTitle: { type: multilingualTextSchema },
  tiktokDescription: { type: multilingualTextSchema },
  tiktokImage: { type: String },
  structuredData: { type: Schema.Types.Mixed }
}, { _id: false });

// Author schema
const authorSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  bio: { type: multilingualTextSchema }
}, { _id: false });

// Main blog schema
const blogSchema = new Schema({
  title: { type: multilingualTextSchema, required: true },
  slug: {
    type: multilingualTextSchema,
    required: true,
    unique: true,
    index: true
  },
  excerpt: { type: multilingualTextSchema, required: true },
  content: { type: multilingualTextSchema, required: true },
  featuredImage: { type: String, required: true },
  gallery: [{ type: String }],
  author: { type: authorSchema, required: true },
  category: { type: multilingualTextSchema, required: true },
  tags: [{ type: multilingualTextSchema }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: { type: Date },
  readingTime: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  seo: { type: seoMetadataSchema, required: true },
  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
blogSchema.index({ 'title.en': 'text', 'title.ar': 'text', 'content.en': 'text', 'content.ar': 'text' });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ views: -1 });
blogSchema.index({ likes: -1 });

// Virtual for URL generation
blogSchema.virtual('url').get(function () {
  return `/blog/${this.slug.en}`;
});

// Pre-save middleware to calculate reading time
blogSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const enWordCount = this.content.en.split(/\s+/).length;
    const arWordCount = this.content.ar.split(/\s+/).length;
    const avgWordCount = (enWordCount + arWordCount) / 2;
    this.readingTime = Math.ceil(avgWordCount / wordsPerMinute);
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Static methods
blogSchema.statics.findPublished = function () {
  return this.find({ status: 'published', isActive: true });
};

blogSchema.statics.findFeatured = function () {
  return this.find({ status: 'published', isActive: true, isFeatured: true });
};

blogSchema.statics.findByCategory = function (category: string) {
  return this.find({
    status: 'published',
    isActive: true,
    $or: [
      { 'category.en': new RegExp(category, 'i') },
      { 'category.ar': new RegExp(category, 'i') }
    ]
  });
};

blogSchema.statics.searchPosts = function (query: string) {
  return this.find({
    status: 'published',
    isActive: true,
    $text: { $search: query }
  }).sort({ score: { $meta: 'textScore' } });
};

// Instance methods
blogSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

blogSchema.methods.incrementLikes = function () {
  this.likes += 1;
  return this.save();
};

export default mongoose.model<IBlog>('Blog', blogSchema);
