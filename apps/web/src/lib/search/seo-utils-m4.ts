// SEO utilities for search and employee profiles

interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  city: string;
  province: string;
  age: number;
  civilStatus: string;
  skills: string[];
  employmentType: string;
  experience: number;
  headline?: string;
  availabilityDate?: string;
  salaryMin: number;
  salaryMax: number;
  photoUrl?: string;
  profileScore: number;
  updatedAt: string;
  slug: string;
}

// Generate structured data for employee profile
export function generateEmployeeStructuredData(profile: EmployeeProfile) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.firstName,
    jobTitle: 'Housekeeper',
    description: profile.headline || `Experienced housekeeper in ${profile.city}, ${profile.province}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city,
      addressRegion: profile.province,
      addressCountry: 'PH',
    },
    url: `${baseUrl}/workers/${profile.slug}`,
    image: profile.photoUrl ? `${baseUrl}${profile.photoUrl}` : undefined,
    knowsAbout: profile.skills,
    workHours: profile.employmentType === 'LIVE_IN' ? 'Live-in' : 'Live-out',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Years of Experience',
        value: profile.experience,
      },
      {
        '@type': 'PropertyValue',
        name: 'Age',
        value: profile.age,
      },
      {
        '@type': 'PropertyValue',
        name: 'Civil Status',
        value: profile.civilStatus,
      },
      {
        '@type': 'PropertyValue',
        name: 'Salary Range',
        value: `₱${profile.salaryMin.toLocaleString()} - ₱${profile.salaryMax.toLocaleString()}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Profile Score',
        value: `${profile.profileScore}%`,
      },
    ],
    offers: {
      '@type': 'Offer',
      description: 'Housekeeping services',
      price: profile.salaryMin,
      priceCurrency: 'PHP',
      availability: profile.availabilityDate ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}

// Generate structured data for search results page
export function generateSearchPageStructuredData(filters: any, results: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Housekeepers and Domestic Helpers',
    description: 'Find verified housekeepers, nannies, and domestic helpers in the Philippines',
    url: `${baseUrl}/workers`,
    numberOfItems: results.length,
    itemListElement: results.map((result, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: result.firstName,
        jobTitle: 'Housekeeper',
        address: {
          '@type': 'PostalAddress',
          addressLocality: result.city,
          addressRegion: result.province,
          addressCountry: 'PH',
        },
        url: `${baseUrl}/workers/${result.slug}`,
        image: result.photoUrl ? `${baseUrl}${result.photoUrl}` : undefined,
        knowsAbout: result.skills,
        workHours: result.employmentType === 'LIVE_IN' ? 'Live-in' : 'Live-out',
      },
    })),
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(filters: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Workers',
      item: `${baseUrl}/workers`,
    },
  ];

  if (filters.province) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: filters.province,
      item: `${baseUrl}/workers?province=${encodeURIComponent(filters.province)}`,
    });
  }

  if (filters.city) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: filters.city,
      item: `${baseUrl}/workers?city=${encodeURIComponent(filters.city)}&province=${encodeURIComponent(filters.province || '')}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Adry',
    description: 'Find your perfect housekeeper in the Philippines. Connect employers with verified domestic helpers, nannies, and housekeepers.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/adry',
      'https://twitter.com/adry',
      'https://instagram.com/adry',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+63-XXX-XXX-XXXX',
      contactType: 'customer service',
      areaServed: 'PH',
      availableLanguage: ['English', 'Filipino'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PH',
    },
    serviceType: 'Domestic Services',
    areaServed: {
      '@type': 'Country',
      name: 'Philippines',
    },
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find a housekeeper on Adry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can search for housekeepers by location, skills, experience, and salary range. Browse profiles and contact those who match your requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are all housekeepers verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all housekeepers on our platform are verified through identity checks, background verification, and document validation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to hire a housekeeper?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Housekeeper salaries vary based on experience, skills, and location. You can filter by salary range to find candidates within your budget.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I hire both live-in and live-out housekeepers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can filter by employment type to find live-in, live-out, or both types of housekeepers based on your needs.',
        },
      },
    ],
  };
}

// Generate sitemap data
export function generateSitemapData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: [
        {
          loc: `${baseUrl}/`,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: '1.0',
        },
        {
          loc: `${baseUrl}/workers`,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: '0.9',
        },
        {
          loc: `${baseUrl}/about`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: '0.7',
        },
        {
          loc: `${baseUrl}/contact`,
          lastmod: new Date().toISOString(),
          changefreq: 'monthly',
          priority: '0.6',
        },
      ],
    },
  };
}

// Generate robots.txt content
export function generateRobotsTxt() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return `User-agent: *
Allow: /
Allow: /workers
Allow: /workers/*
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /static/

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-workers.xml`;
}

// Generate meta tags for social sharing
export function generateSocialMetaTags(profile: EmployeeProfile) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    'og:title': `${profile.firstName} - Housekeeper in ${profile.city}, ${profile.province}`,
    'og:description': `${profile.firstName} is a ${profile.experience}-year experienced housekeeper specializing in ${profile.skills.slice(0, 3).join(', ')}.`,
    'og:image': profile.photoUrl ? `${baseUrl}${profile.photoUrl}` : `${baseUrl}/og-default.jpg`,
    'og:url': `${baseUrl}/workers/${profile.slug}`,
    'og:type': 'profile',
    'og:site_name': 'Adry',
    'og:locale': 'en_PH',
    'twitter:card': 'summary_large_image',
    'twitter:title': `${profile.firstName} - Housekeeper in ${profile.city}, ${profile.province}`,
    'twitter:description': `${profile.firstName} is a ${profile.experience}-year experienced housekeeper specializing in ${profile.skills.slice(0, 3).join(', ')}.`,
    'twitter:image': profile.photoUrl ? `${baseUrl}${profile.photoUrl}` : `${baseUrl}/og-default.jpg`,
    'twitter:site': '@adry',
    'twitter:creator': '@adry',
  };
}

// Generate canonical URL
export function generateCanonicalUrl(path: string, queryParams?: Record<string, string>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams);
    return `${baseUrl}${path}?${searchParams.toString()}`;
  }
  
  return `${baseUrl}${path}`;
}

// Generate page title
export function generatePageTitle(title: string, siteName: string = 'Adry') {
  return `${title} | ${siteName}`;
}

// Generate meta description
export function generateMetaDescription(description: string, maxLength: number = 160) {
  if (description.length <= maxLength) {
    return description;
  }
  
  return description.substring(0, maxLength - 3) + '...';
}

// Generate keywords array
export function generateKeywords(baseKeywords: string[], additionalKeywords: string[] = []) {
  const allKeywords = [...baseKeywords, ...additionalKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];
  return uniqueKeywords.filter(keyword => keyword.length > 0);
}
