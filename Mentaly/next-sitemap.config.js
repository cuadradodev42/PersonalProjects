/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mentaly.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*', '/_next/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
    ],
    additionalSitemaps: [
      'https://mentaly.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Personalizar prioridades y frecuencias
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };

    // Rutas específicas con mayor prioridad
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'weekly';
    } else if (path === '/dashboard') {
      customConfig.priority = 0.9;
      customConfig.changefreq = 'daily';
    } else if (['/habits', '/stats', '/achievements'].includes(path)) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'weekly';
    }

    return customConfig;
  },
};
