import mongoose from 'mongoose';
import Content from '../models/Content';
import dotenv from 'dotenv';

dotenv.config();

const aboutHomeContent = {
  section: 'about-home',
  title: {
    en: 'Your Trusted Real Estate Partner',
    ar: 'شريكك العقاري الموثوق',
    fr: 'Votre partenaire immobilier de confiance'
  },
  description: {
    en: 'We provide a comprehensive portfolio of services designed for individuals, families, developers, corporate tenants, and institutional investors. By combining local expertise with international standards, every transaction is managed with professionalism and integrity.',
    ar: 'نحن نقدم محفظة شاملة من الخدمات مصممة للأفراد والعائلات والمطورين والمستأجرين الشركات والمستثمرين المؤسسيين. من خلال الجمع بين الخبرة المحلية والمعايير الدولية، يتم إدارة كل معاملة بمهنية وسلامة.',
    fr: 'Nous fournissons un portefeuille complet de services conçus pour les particuliers, les familles, les promoteurs, les locataires d\'entreprises et les investisseurs institutionnels. En combinant l\'expertise locale et les normes internationales, chaque transaction est gérée avec professionnalisme et intégrité.'
  },
  isActive: true,
  order: 1,
  metadata: {
    badge: {
      en: 'ABOUT N&H HOMES REAL ESTATE',
      ar: 'عن N&H العقارية',
      fr: 'À PROPOS DE N&H IMMOBILIER'
    },
    description2: {
      en: '',
      ar: '',
      fr: ''
    },
    features: [
      {
        icon: '🏆',
        title: {
          en: 'Award-Winning Service',
          ar: 'خدمة حائزة على جوائز',
          fr: 'Service primé'
        },
        description: {
          en: 'Recognized excellence in real estate',
          ar: 'تميز معترف به في العقارات',
          fr: 'Excellence reconnue dans l\'immobilier'
        }
      },
      {
        icon: '🌍',
        title: {
          en: 'Global Network',
          ar: 'شبكة عالمية',
          fr: 'Réseau mondial'
        },
        description: {
          en: 'Properties across 8 countries',
          ar: 'عقارات في 8 دول',
          fr: 'Propriétés dans 8 pays'
        }
      },
      {
        icon: '🤝',
        title: {
          en: 'Trusted Expertise',
          ar: 'خبرة موثوقة',
          fr: 'Expertise de confiance'
        },
        description: {
          en: '15+ years of market experience',
          ar: 'أكثر من 15 عامًا من الخبرة في السوق',
          fr: 'Plus de 15 ans d\'expérience du marché'
        }
      }
    ],
    statNumber: '1000+',
    statLabel: {
      en: 'Happy Clients',
      ar: 'عملاء سعداء',
      fr: 'Clients satisfaits'
    }
  }
};

async function seedContent() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hnrealstate';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Check if about-home content already exists
    const existing = await Content.findOne({ section: 'about-home' });
    
    if (existing) {
      console.log('About-home content already exists, updating...');
      await Content.findByIdAndUpdate(existing._id, aboutHomeContent, { new: true });
      console.log('✅ About-home content updated successfully');
    } else {
      console.log('Creating new about-home content...');
      await Content.create(aboutHomeContent);
      console.log('✅ About-home content created successfully');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding content:', error);
    process.exit(1);
  }
}

seedContent();

