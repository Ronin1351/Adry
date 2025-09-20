import { prisma } from '@/lib/db';
import { parseEmployeeSlug } from './search-utils';

// Get employee profile by slug
export async function getEmployeeProfileBySlug(slug: string) {
  try {
    const parsed = parseEmployeeSlug(slug);
    if (!parsed) {
      return null;
    }

    const { userId } = parsed;

    const profile = await prisma.employeeProfile.findUnique({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        city: true,
        province: true,
        age: true,
        civilStatus: true,
        skills: true,
        experience: true,
        employmentType: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
        visibility: true, // Only show if visible
      },
    });

    if (!profile || !profile.visibility) {
      return null;
    }

    // Add computed fields for display
    const enhancedProfile = {
      id: profile.userId,
      first_name: profile.firstName,
      city: profile.city,
      province: profile.province,
      age: profile.age,
      civil_status: profile.civilStatus,
      skills: profile.skills || [],
      years_of_experience: profile.experience,
      live_in_out: profile.employmentType,
      headline: profile.headline,
      availability_date: profile.availabilityDate?.toISOString(),
      salary_min: profile.salaryMin,
      salary_max: profile.salaryMax,
      photo_url: profile.photoUrl,
      profile_score: profile.profileScore || 0,
      updated_at: profile.updatedAt.toISOString(),
      slug,
    };

    return enhancedProfile;
  } catch (error) {
    console.error('Error getting employee profile by slug:', error);
    return null;
  }
}

// Get employee profile by user ID
export async function getEmployeeProfileById(userId: string) {
  try {
    const profile = await prisma.employeeProfile.findUnique({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        city: true,
        province: true,
        age: true,
        civilStatus: true,
        skills: true,
        experience: true,
        employmentType: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
        visibility: true,
      },
    });

    if (!profile || !profile.visibility) {
      return null;
    }

    // Generate slug
    const slug = generateSlug(profile.firstName, profile.city, profile.userId);

    // Add computed fields
    const enhancedProfile = {
      id: profile.userId,
      first_name: profile.firstName,
      city: profile.city,
      province: profile.province,
      age: profile.age,
      civil_status: profile.civilStatus,
      skills: profile.skills || [],
      years_of_experience: profile.experience,
      live_in_out: profile.employmentType,
      headline: profile.headline,
      availability_date: profile.availabilityDate?.toISOString(),
      salary_min: profile.salaryMin,
      salary_max: profile.salaryMax,
      photo_url: profile.photoUrl,
      profile_score: profile.profileScore || 0,
      updated_at: profile.updatedAt.toISOString(),
      slug,
    };

    return enhancedProfile;
  } catch (error) {
    console.error('Error getting employee profile by ID:', error);
    return null;
  }
}

// Generate SEO-friendly slug
function generateSlug(firstName: string, city: string, userId: string): string {
  const cleanName = firstName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const cleanCity = city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${cleanName}-${cleanCity}-${userId}`;
}
