export function generateStructuredData(data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
  };
}

export function generateBreadcrumbStructuredData(items: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
