/**
 * Translations configuration for multi-language support
 * Supports: Indonesian (id) and English (en)
 */

const translations = {
  id: {
    // Meta
    lang: 'id',
    langName: 'Indonesia',
    
    // Navigation
    nav: {
      home: 'Beranda',
      about: 'Tentang Kami',
      visionMission: 'Visi Misi',
      businessUnits: 'Unit Bisnis',
      branches: 'Info Cabang',
      news: 'Berita',
      contact: 'Kontak',
      admin: 'Admin',
      login: 'Masuk',
      logout: 'Keluar'
    },
    
    // URLs (localized paths)
    urls: {
      home: '/id',
      about: '/id/tentang-kami',
      visionMission: '/id/visi-misi',
      businessUnits: '/id/unit-bisnis',
      branches: '/id/cabang',
      news: '/id/berita',
      contact: '#footer'
    },
    
    // Business Units
    businessUnitUrls: {
      bosowabandarindonesia: '/id/unit-bisnis/bosowa-bandar-indonesia',
      bosowabandaragensi: '/id/unit-bisnis/bosowa-bandar-agensi',
      jasapelabuhanindonesia: '/id/unit-bisnis/jasa-pelabuhan-indonesia'
    },
    
    // Homepage
    home: {
      title: 'Bosowa Bandar Group - Beranda',
      heroTitle1: 'Temukan Layanan Terbaik Untuk Armada Anda',
      heroSubtitle1: 'Bosowa Bandar adalah mitra terdepan dalam layanan keagenan kapal dan pengelolaan pelabuhan, menawarkan efisiensi dan keandalan tinggi.',
      heroTitle2: 'Pelayanan Bongkar Muat Cepat, Aman, dan Profesional',
      heroSubtitle2: 'Dengan armada modern dan tenaga ahli berpengalaman, kami memberikan jasa bongkar muat terbaik untuk kapal kargo, container, dan berbagai jenis muatan.',
      heroTitle3: 'Solusi Terpadu untuk Keagenan dan Tunda Kapal',
      heroSubtitle3: 'Bosowa Bandar menyediakan layanan keagenan kapal yang komprehensif serta jasa tunda dengan armada kapal tunda yang handal dan berpengalaman.',
      learnMore: 'Pelajari Lebih Lanjut',
      contactUs: 'Hubungi Kami',
      businessUnitsTitle: 'Unit Bisnis',
      businessUnitsDesc: 'Melalui berbagai unit bisnis, Bosowa Bandar terus memperkuat perannya sebagai penggerak utama sektor logistik dan pelabuhan di kawasan timur Indonesia.',
      trustedSince: 'Terpercaya Sejak 2012',
      trustedDesc: 'Sejak 2012, kami telah melayani berbagai perusahaan nasional dan internasional dengan layanan yang berkualitas dan terpercaya.',
      yearsExp: 'Tahun',
      ships: 'Kapal',
      partners: 'Mitra',
      ourPartners: 'Mitra Kami',
      partnersDesc: 'Kami bangga bermitra dengan berbagai perusahaan terkemuka di industri pelayaran dan logistik.',
      latestNews: 'Berita Terbaru',
      newsDesc: 'Ikuti perkembangan terbaru dari Bosowa Bandar Group',
      readMore: 'Baca Selengkapnya',
      viewAllNews: 'Lihat Semua Berita'
    },
    
    // Services
    services: {
      shipAgency: 'Keagenan Kapal',
      shipAgencyDesc: 'Layanan keagenan kapal yang komprehensif, termasuk pengurusan dokumen, koordinasi dengan otoritas pelabuhan, dan dukungan logistik untuk kapal-kapal yang berlabuh.',
      cargoHandling: 'Bongkar Muat',
      cargoHandlingDesc: 'Jasa bongkar muat profesional dengan peralatan modern dan tenaga kerja terlatih, memastikan proses yang efisien dan aman untuk berbagai jenis kargo.',
      tugBoat: 'Kapal Tunda',
      tugBoatDesc: 'Layanan kapal tunda (tug assist) untuk membantu kapal lain, baik dalam mendorong, menarik, maupun menggandeng kapal, khususnya saat akan merapat atau meninggalkan dermaga di pelabuhan.'
    },
    
    // About Page
    about: {
      title: 'Tentang Kami',
      pageTitle: 'Tentang Bosowa Bandar Group',
      description: 'Bosowa Bandar Group adalah perusahaan yang bergerak di bidang jasa keagenan kapal, bongkar muat, dan pengelolaan pelabuhan yang berbasis di Makassar, Sulawesi Selatan.'
    },
    
    // Vision Mission
    visionMission: {
      title: 'Visi & Misi',
      vision: 'Visi',
      mission: 'Misi',
      visionText: 'Menjadi perusahaan jasa pelabuhan dan keagenan kapal terkemuka di Indonesia Timur yang profesional, terpercaya, dan berorientasi pada kepuasan pelanggan.',
      missionItems: [
        'Memberikan layanan terbaik kepada pelanggan dengan standar kualitas tinggi',
        'Mengembangkan sumber daya manusia yang kompeten dan profesional',
        'Menjalin kemitraan strategis yang saling menguntungkan',
        'Berkontribusi pada pembangunan ekonomi daerah dan nasional'
      ]
    },
    
    // News
    news: {
      title: 'Berita & Artikel',
      noNews: 'Belum ada berita.'
    },
    
    // Branches
    branches: {
      title: 'Info Cabang',
      address: 'Alamat',
      phone: 'Telepon',
      email: 'Email',
      viewMap: 'Lihat di Google Maps'
    },
    
    // Footer
    footer: {
      companyDesc: 'Bosowa Bandar Group adalah perusahaan yang bergerak di bidang jasa keagenan kapal, bongkar muat, dan pengelolaan pelabuhan.',
      quickLinks: 'Tautan Cepat',
      contactInfo: 'Kontak',
      followUs: 'Ikuti Kami',
      copyright: '© 2024 Bosowa Bandar Group. Hak Cipta Dilindungi.'
    },
    
    // Common
    common: {
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      notFound: 'Halaman tidak ditemukan',
      backToHome: 'Kembali ke Beranda'
    }
  },
  
  en: {
    // Meta
    lang: 'en',
    langName: 'English',
    
    // Navigation
    nav: {
      home: 'Home',
      about: 'About Us',
      visionMission: 'Vision & Mission',
      businessUnits: 'Business Units',
      branches: 'Branches',
      news: 'News',
      contact: 'Contact',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout'
    },
    
    // URLs (localized paths)
    urls: {
      home: '/en',
      about: '/en/about-us',
      visionMission: '/en/vision-mission',
      businessUnits: '/en/business-units',
      branches: '/en/branches',
      news: '/en/news',
      contact: '#footer'
    },
    
    // Business Units
    businessUnitUrls: {
      bosowabandarindonesia: '/en/business-units/bosowa-bandar-indonesia',
      bosowabandaragensi: '/en/business-units/bosowa-bandar-agensi',
      jasapelabuhanindonesia: '/en/business-units/jasa-pelabuhan-indonesia'
    },
    
    // Homepage
    home: {
      title: 'Bosowa Bandar Group - Home',
      heroTitle1: 'Discover the Best Services for Your Fleet',
      heroSubtitle1: 'Bosowa Bandar is a leading partner in ship agency services and port management, offering high efficiency and reliability.',
      heroTitle2: 'Fast, Safe, and Professional Cargo Handling',
      heroSubtitle2: 'With modern fleet and experienced professionals, we provide the best cargo handling services for cargo ships, containers, and various types of cargo.',
      heroTitle3: 'Integrated Solutions for Ship Agency and Tugboat Services',
      heroSubtitle3: 'Bosowa Bandar provides comprehensive ship agency services and tugboat services with reliable and experienced tugboat fleet.',
      learnMore: 'Learn More',
      contactUs: 'Contact Us',
      businessUnitsTitle: 'Business Units',
      businessUnitsDesc: 'Through various business units, Bosowa Bandar continues to strengthen its role as the main driver of the logistics and port sector in eastern Indonesia.',
      trustedSince: 'Trusted Since 2012',
      trustedDesc: 'Since 2012, we have served various national and international companies with quality and trusted services.',
      yearsExp: 'Years',
      ships: 'Ships',
      partners: 'Partners',
      ourPartners: 'Our Partners',
      partnersDesc: 'We are proud to partner with leading companies in the shipping and logistics industry.',
      latestNews: 'Latest News',
      newsDesc: 'Follow the latest updates from Bosowa Bandar Group',
      readMore: 'Read More',
      viewAllNews: 'View All News'
    },
    
    // Services
    services: {
      shipAgency: 'Ship Agency',
      shipAgencyDesc: 'Comprehensive ship agency services, including document processing, coordination with port authorities, and logistics support for docked vessels.',
      cargoHandling: 'Cargo Handling',
      cargoHandlingDesc: 'Professional cargo handling services with modern equipment and trained workforce, ensuring efficient and safe processes for various types of cargo.',
      tugBoat: 'Tugboat',
      tugBoatDesc: 'Tugboat services (tug assist) to help other ships, both in pushing, pulling, and towing ships, especially when docking or leaving the port.'
    },
    
    // About Page
    about: {
      title: 'About Us',
      pageTitle: 'About Bosowa Bandar Group',
      description: 'Bosowa Bandar Group is a company engaged in ship agency services, cargo handling, and port management based in Makassar, South Sulawesi.'
    },
    
    // Vision Mission
    visionMission: {
      title: 'Vision & Mission',
      vision: 'Vision',
      mission: 'Mission',
      visionText: 'To become the leading port and ship agency company in Eastern Indonesia that is professional, trusted, and customer satisfaction oriented.',
      missionItems: [
        'Provide the best service to customers with high quality standards',
        'Develop competent and professional human resources',
        'Establish mutually beneficial strategic partnerships',
        'Contribute to regional and national economic development'
      ]
    },
    
    // News
    news: {
      title: 'News & Articles',
      noNews: 'No news available.'
    },
    
    // Branches
    branches: {
      title: 'Branch Information',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      viewMap: 'View on Google Maps'
    },
    
    // Footer
    footer: {
      companyDesc: 'Bosowa Bandar Group is a company engaged in ship agency services, cargo handling, and port management.',
      quickLinks: 'Quick Links',
      contactInfo: 'Contact',
      followUs: 'Follow Us',
      copyright: '© 2024 Bosowa Bandar Group. All Rights Reserved.'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      notFound: 'Page not found',
      backToHome: 'Back to Home'
    }
  }
};

/**
 * Get translation for a specific language
 * @param {string} lang - Language code ('id' or 'en')
 * @returns {object} Translation object
 */
function getTranslation(lang) {
  return translations[lang] || translations.id;
}

/**
 * Get supported languages
 * @returns {string[]} Array of supported language codes
 */
function getSupportedLanguages() {
  return Object.keys(translations);
}

module.exports = {
  translations,
  getTranslation,
  getSupportedLanguages
};
