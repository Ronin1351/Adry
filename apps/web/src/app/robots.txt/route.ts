import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Allow: /workers
Allow: /workers/*
Allow: /about
Allow: /contact
Allow: /pricing

# Disallow private areas
Disallow: /dashboard
Disallow: /api
Disallow: /admin
Disallow: /auth
Disallow: /_next
Disallow: /static

# Disallow search parameters that don't add value
Disallow: /workers?*
Disallow: /workers/*?*

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (be respectful)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}