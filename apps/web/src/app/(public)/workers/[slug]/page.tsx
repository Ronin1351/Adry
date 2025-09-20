import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getEmployeeProfileBySlug } from '@/lib/search/employee-profile-utils';
import { generateEmployeeStructuredData } from '@/lib/seo/structured-data';
import { EmployeeProfilePage } from '@/components/profile/EmployeeProfilePage';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface EmployeeProfilePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: EmployeeProfilePageProps): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const profile = await getEmployeeProfileBySlug(slug);
    
    if (!profile) {
      return {
        title: 'Employee Not Found | Adry',
        description: 'The requested employee profile could not be found.',
      };
    }

    const title = `${profile.first_name} - Housekeeper in ${profile.city}, ${profile.province} | Adry`;
    const description = `${profile.first_name} is a ${profile.years_of_experience}-year experienced housekeeper in ${profile.city}, ${profile.province}. Specializes in ${profile.skills.slice(0, 3).join(', ')}. ${profile.headline || 'Available for live-in and live-out work.'}`;
    
    const keywords = [
      'housekeeper',
      'domestic helper',
      'nanny',
      'babysitter',
      'cook',
      'driver',
      profile.first_name,
      profile.city,
      profile.province,
      ...profile.skills,
      profile.live_in_out === 'LIVE_IN' ? 'live-in' : 'live-out',
    ];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'profile',
        locale: 'en_PH',
        siteName: 'Adry - Find Your Perfect Housekeeper',
        images: profile.photo_url ? [
          {
            url: profile.photo_url,
            width: 400,
            height: 400,
            alt: `${profile.first_name} profile photo`,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: profile.photo_url ? [profile.photo_url] : [],
      },
      alternates: {
        canonical: `/workers/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for employee profile:', error);
    return {
      title: 'Employee Profile | Adry',
      description: 'View employee profile on Adry.',
    };
  }
}

export default async function EmployeeProfilePageRoute({ params }: EmployeeProfilePageProps) {
  const { slug } = params;
  
  try {
    const profile = await getEmployeeProfileBySlug(slug);
    
    if (!profile) {
      notFound();
    }

    const structuredData = generateEmployeeStructuredData(profile);

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gray-50">
          {/* Breadcrumb */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Workers', href: '/workers' },
                  { label: `${profile.first_name}`, href: `/workers/${slug}` },
                ]}
              />
            </div>
          </div>

          {/* Profile Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EmployeeProfilePage profile={profile} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading employee profile:', error);
    notFound();
  }
}

// Generate static params for popular profiles (ISR)
export async function generateStaticParams() {
  try {
    // This would fetch popular profiles for static generation
    // For now, return empty array to use dynamic rendering
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}