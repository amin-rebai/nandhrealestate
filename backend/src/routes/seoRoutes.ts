import express from 'express';
import { generateSitemap, getRobotsTxt, getPropertySeo, getBlogSeo, getGlobalSeo, getFaqSeo } from '../controllers/seoController';

const router = express.Router();

// SEO endpoints (public)
router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', getRobotsTxt);

// SEO data endpoints
router.get('/seo/property/:id', getPropertySeo);
router.get('/seo/blog/:slug', getBlogSeo);
router.get('/seo/global', getGlobalSeo);
router.get('/seo/faq', getFaqSeo);

export default router;
