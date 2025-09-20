// SEO structured data utilities

interface EmployeeProfile {
  id: string;
  first_name: string;
  city: string;
  province: string;
  age: number;
  civil_status: string;
  skills: string[];
  years_of_experience: number;
  live_in_out: string;
  headline?: string;
  availability_date?: string;
  salary_min: number;
  salary_max: number;
  photo_url?: string;
  profile_score: number;
  updated_at: string;
  slug: string;
}

// Generate structured data for employee profile
export function generateEmployeeStructuredData(profile: EmployeeProfile) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adry.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.first_name,
    jobTitle: 'Housekeeper',
    description: profile.headline || `Experienced housekeeper in ${profile.city}, ${profile.province}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city,
      addressRegion: profile.province,
      addressCountry: 'PH',
    },
    url: `${baseUrl}/workers/${profile.slug}`,
    image: profile.photo_url ? `${baseUrl}${profile.photo_url}` : undefined,
    knowsAbout: profile.skills,
    workHours: profile.live_in_out === 'LIVE_IN' ? 'Live-in' : 'Live-out',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Years of Experience',
        value: profile.years_of_experience,
      },
      {
        '@type': 'PropertyValue',
        name: 'Age',
        value: profile.age,
      },
      {
        '@type': 'PropertyValue',
        name: 'Civil Status',
        value: profile.civil_status,
      },
      {
        '@type': 'PropertyValue',
        name: 'Salary Range',
        value: `₱${profile.salary_min.toLocaleString()} - ₱${profile.salary_max.toLocaleString()}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Profile Score',
        value: `${profile.profile_score}%`,
      },
    ],
    offers: {
      '@type': 'Offer',
      description: 'Housekeeping services',
      price: profile.salary_min,
      priceCurrency: 'PHP',
      availability: profile.availability_date ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
        name: result.first_name,
        jobTitle: 'Housekeeper',
        address: {
          '@type': 'PostalAddress',
          addressLocality: result.city,
          addressRegion: result.province,
          addressCountry: 'PH',
        },
        url: `${baseUrl}/workers/${result.slug}`,
        image: result.photo_url ? `${baseUrl}${result.photo_url}` : undefined,
        knowsAbout: result.skills,
        workHours: result.live_in_out === 'LIVE_IN' ? 'Live-in' : 'Live-out',
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
