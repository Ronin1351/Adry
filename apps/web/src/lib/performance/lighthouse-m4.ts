// Lighthouse performance monitoring and optimization utilities for M4

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  totalBlockingTime?: number;
}

export interface PerformanceBudget {
  maxBundleSize: number; // in KB
  maxImageSize: number; // in KB
  maxFontSize: number; // in KB
  maxCssSize: number; // in KB
  maxJsSize: number; // in KB
}

// Performance budgets for M4
export const PERFORMANCE_BUDGETS: PerformanceBudget = {
  maxBundleSize: 500, // 500KB
  maxImageSize: 200, // 200KB
  maxFontSize: 100, // 100KB
  maxCssSize: 50, // 50KB
  maxJsSize: 300, // 300KB
};

// Core Web Vitals thresholds
export const CORE_WEB_VITALS = {
  LCP: {
    good: 2500, // 2.5s
    needsImprovement: 4000, // 4s
  },
  FID: {
    good: 100, // 100ms
    needsImprovement: 300, // 300ms
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800, // 1.8s
    needsImprovement: 3000, // 3s
  },
  TBT: {
    good: 200, // 200ms
    needsImprovement: 600, // 600ms
  },
} as const;

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
  quality: 75,
  formats: ['webp', 'avif', 'jpeg'],
  sizes: [320, 640, 768, 1024, 1280, 1920],
  placeholder: 'blur',
} as const;

// Font optimization
export const FONT_OPTIMIZATION = {
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto'],
} as const;

// Resource hints
export const RESOURCE_HINTS = {
  dns: ['fonts.googleapis.com', 'fonts.gstatic.com'],
  preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  prefetch: ['/workers', '/api/search/facets'],
} as const;

// Critical CSS for above-the-fold content
export const CRITICAL_CSS = `
  /* Critical styles for workers page */
  .workers-page {
    min-height: 100vh;
    background-color: #f9fafb;
  }
  
  .workers-header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .workers-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .workers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .worker-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .worker-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

// Performance monitoring functions
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
    });
  } else {
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
}

export function measureWebVitals() {
  // Measure LCP
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

// Bundle size monitoring
export function checkBundleSize(bundleName: string, size: number) {
  const budget = PERFORMANCE_BUDGETS.maxBundleSize;
  const status = size <= budget ? 'good' : size <= budget * 1.2 ? 'needs-improvement' : 'poor';
  
  console.log(`Bundle ${bundleName}: ${size}KB (${status})`);
  
  if (status === 'poor') {
    console.warn(`Bundle ${bundleName} exceeds budget by ${((size / budget - 1) * 100).toFixed(1)}%`);
  }
  
  return status;
}

// Image optimization utilities
export function getOptimizedImageUrl(src: string, width: number, quality: number = IMAGE_OPTIMIZATION.quality) {
  // This would integrate with your image optimization service
  return `${src}?w=${width}&q=${quality}&f=webp`;
}

export function generateImageSrcSet(src: string, sizes: number[] = IMAGE_OPTIMIZATION.sizes) {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, size)} ${size}w`)
    .join(', ');
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/inter-var.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical images
  const criticalImages = [
    '/images/hero-bg.webp',
    '/images/logo.webp',
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Lazy loading utility
export function setupLazyLoading() {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[data-lazy]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.lazy || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      imgElement.src = imgElement.dataset.lazy || '';
    });
  }
}

// Performance score calculation
export function calculatePerformanceScore(metrics: Partial<LighthouseMetrics>): number {
  const weights = {
    performance: 0.4,
    accessibility: 0.25,
    bestPractices: 0.15,
    seo: 0.2,
  };

  let score = 0;
  let totalWeight = 0;

  Object.entries(weights).forEach(([key, weight]) => {
    const value = metrics[key as keyof LighthouseMetrics];
    if (value !== undefined) {
      score += value * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
}

// Performance monitoring hook for React
export function usePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Monitor page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.log('Page Load Performance:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart,
    });
  });

  // Monitor search performance
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const start = performance.now();
    const result = await originalFetch(...args);
    const end = performance.now();
    
    if (args[0].toString().includes('/api/search')) {
      console.log(`Search API call took ${end - start}ms`);
    }
    
    return result;
  };
}