import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdryPublicProfile } from '../../../components/Profile/AdryPublicProfile';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

// This would normally fetch from your API
async function getProfile(id: string) {
  // Mock data for demonstration
  const mockProfile = {
    id: '1',
    firstName: 'Maria',
    lastName: 'Santos',
    age: 28,
    location: 'Quezon City, Metro Manila',
    skills: ['Cooking', 'Childcare', 'Laundry', 'Ironing', 'General Housekeeping'],
    experience: 5,
    salaryMin: 8000,
    salaryMax: 12000,
    employmentType: 'LIVE_IN',
    isVerified: true,
    profilePhotoUrl: null,
    languages: ['Tagalog', 'English'],
    availabilityDate: '2024-02-01',
    bio: 'Experienced housekeeper with 5 years of dedicated service. Specialized in cooking, childcare, and general housekeeping. Reliable, trustworthy, and committed to providing excellent household services.',
    city: 'Quezon City',
    province: 'Metro Manila',
    civilStatus: 'SINGLE',
    gender: 'Female',
    workHistory: [
      {
        id: '1',
        employerName: 'Smith Family',
        position: 'Housekeeper',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        current: false,
        description: 'Provided full-time housekeeping services including cooking, cleaning, and childcare.',
      },
      {
        id: '2',
        employerName: 'Johnson Family',
        position: 'Live-in Housekeeper',
        startDate: '2019-06-01',
        endDate: '2021-12-31',
        current: false,
        description: 'Managed household duties and provided childcare for two children.',
      },
    ],
    references: [
      {
        id: '1',
        name: 'Mrs. Smith',
        relationship: 'Previous Employer',
        phoneNumber: '+63 912 345 6789',
        email: 'smith@email.com',
        company: 'Smith Family',
      },
    ],
    documents: [
      {
        id: '1',
        type: 'PHILID',
        status: 'VERIFIED',
        verifiedAt: '2024-01-15',
      },
      {
        id: '2',
        type: 'PHILHEALTH',
        status: 'VERIFIED',
        verifiedAt: '2024-01-15',
      },
      {
        id: '3',
        type: 'PAGIBIG',
        status: 'VERIFIED',
        verifiedAt: '2024-01-15',
      },
    ],
  };

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockProfile;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const profile = await getProfile(params.id);
  
  if (!profile) {
    return {
      title: 'Profile Not Found - Adry',
      description: 'The requested housekeeper profile could not be found.',
    };
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const title = `${fullName} - Experienced Housekeeper in ${profile.location} | Adry`;
  const description = `Find ${fullName}, a verified housekeeper in ${profile.location} with ${profile.experience} years experience. Specialized in ${profile.skills.slice(0, 3).join(', ')}. Available for ${profile.employmentType.toLowerCase()} work.`;

  return {
    title,
    description,
    keywords: [
      'housekeeper',
      'maid',
      'domestic helper',
      profile.firstName,
      profile.lastName,
      profile.location,
      ...profile.skills,
      'Philippines',
      'verified',
      'experienced',
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile.profilePhotoUrl ? [profile.profilePhotoUrl] : [],
      locale: 'en_PH',
      siteName: 'Adry',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.profilePhotoUrl ? [profile.profilePhotoUrl] : [],
    },
    alternates: {
      canonical: `/profile/${params.id}`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfile(params.id);
  
  if (!profile) {
    notFound();
  }

  return <AdryPublicProfile profile={profile} />;
}
