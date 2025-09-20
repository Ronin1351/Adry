import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock API handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/signin', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'EMPLOYEE',
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/signup', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'EMPLOYEE',
      },
      token: 'mock-jwt-token',
    });
  }),

  // Profile endpoints
  http.get('/api/profiles/employee/:id', () => {
    return HttpResponse.json({
      id: '1',
      userId: '1',
      civilStatus: 'SINGLE',
      location: 'Quezon City, Metro Manila',
      phone: '+63 912 345 6789',
      skills: ['Cooking', 'Childcare', 'Laundry'],
      experienceText: '5 years of experience',
      salaryMin: 8000,
      salaryMax: 12000,
      liveIn: true,
      visibility: true,
    });
  }),

  // Search endpoints
  http.get('/api/search/profiles', () => {
    return HttpResponse.json({
      hits: [
        {
          id: '1',
          name: 'Maria Santos',
          location: 'Quezon City, Metro Manila',
          skills: ['Cooking', 'Childcare'],
          experience: 5,
          salaryMin: 8000,
          salaryMax: 12000,
        },
        {
          id: '2',
          name: 'Ana Cruz',
          location: 'Makati City, Metro Manila',
          skills: ['Cooking', 'Elderly Care'],
          experience: 8,
          salaryMin: 10000,
          salaryMax: 15000,
        },
      ],
      totalHits: 2,
      page: 1,
      totalPages: 1,
    });
  }),

  // Subscription endpoints
  http.get('/api/subscriptions/status', () => {
    return HttpResponse.json({
      hasActiveSubscription: true,
      canMessage: true,
      canSchedule: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  }),

  // Messages endpoints
  http.get('/api/messages', () => {
    return HttpResponse.json({
      messages: [
        {
          id: '1',
          content: 'Hello! I am interested in your services.',
          senderId: '1',
          receiverId: '2',
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }),

  // File upload endpoints
  http.post('/api/upload/profile-photo', () => {
    return HttpResponse.json({
      url: 'https://example.com/profile-photo.jpg',
    });
  }),

  http.post('/api/upload/document', () => {
    return HttpResponse.json({
      url: 'https://example.com/document.pdf',
    });
  }),
];

export const server = setupServer(...handlers);
