/**
 * Language Middleware
 * Handles language detection from URL and provides translations to views
 */

const { getTranslation, getSupportedLanguages } = require('../config/translations');

/**
 * Language middleware for routes with /:lang prefix
 */
function languageMiddleware(req, res, next) {
  const lang = req.params.lang;
  const supportedLangs = getSupportedLanguages();
  
  // Validate language
  if (!supportedLangs.includes(lang)) {
    // Invalid language, redirect to default (Indonesian)
    return res.redirect('/id' + req.path.replace(/^\/[^/]+/, ''));
  }
  
  // Set language in request and response locals
  req.lang = lang;
  res.locals.lang = lang;
  res.locals.t = getTranslation(lang);
  
  // Set alternate language for language switcher
  res.locals.altLang = lang === 'id' ? 'en' : 'id';
  
  // Get current path without language prefix for language switching
  const pathWithoutLang = req.originalUrl.replace(/^\/(id|en)/, '');
  res.locals.currentPath = pathWithoutLang || '/';
  
  // Map paths for language switching
  res.locals.getAltLangUrl = function() {
    const altLang = res.locals.altLang;
    const currentPath = res.locals.currentPath;
    
    // Path mappings between languages
    const pathMappings = {
      // ID to EN
      '/tentang-kami': { en: '/about-us', id: '/tentang-kami' },
      '/visi-misi': { en: '/vision-mission', id: '/visi-misi' },
      '/cabang': { en: '/branches', id: '/cabang' },
      '/berita': { en: '/news', id: '/berita' },
      '/unit-bisnis': { en: '/business-units', id: '/unit-bisnis' },
      // EN to ID
      '/about-us': { id: '/tentang-kami', en: '/about-us' },
      '/vision-mission': { id: '/visi-misi', en: '/vision-mission' },
      '/branches': { id: '/cabang', en: '/branches' },
      '/news': { id: '/berita', en: '/news' },
      '/business-units': { id: '/unit-bisnis', en: '/business-units' }
    };
    
    // Check if current path needs mapping
    for (const [path, mappings] of Object.entries(pathMappings)) {
      if (currentPath.startsWith(path)) {
        const newPath = currentPath.replace(path, mappings[altLang]);
        return '/' + altLang + newPath;
      }
    }
    
    // Default: just change the language prefix
    return '/' + altLang + currentPath;
  };
  
  next();
}

/**
 * Redirect root to default language
 */
function redirectToDefaultLanguage(req, res) {
  res.redirect('/id');
}

module.exports = {
  languageMiddleware,
  redirectToDefaultLanguage
};
