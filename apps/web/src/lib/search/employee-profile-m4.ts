import { prisma } from '@/lib/db';
import { generateEmployeeSlug, parseEmployeeSlug } from './search-utils-m4';

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
        employmentType: true,
        experience: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return null;
    }

    // Add computed fields
    const enhancedProfile = {
      ...profile,
      id: profile.userId,
      slug,
      updatedAt: profile.updatedAt.toISOString(),
      availabilityDate: profile.availabilityDate?.toISOString(),
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
        employmentType: true,
        experience: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return null;
    }

    // Generate slug
    const slug = generateEmployeeSlug(profile.firstName, profile.city, profile.userId);

    // Add computed fields
    const enhancedProfile = {
      ...profile,
      id: profile.userId,
      slug,
      updatedAt: profile.updatedAt.toISOString(),
      availabilityDate: profile.availabilityDate?.toISOString(),
    };

    return enhancedProfile;
  } catch (error) {
    console.error('Error getting employee profile by ID:', error);
    return null;
  }
}

// Get all public employee profiles for indexing
export async function getAllPublicEmployeeProfiles() {
  try {
    const profiles = await prisma.employeeProfile.findMany({
      where: {
        visibility: true, // Only visible profiles
      },
      select: {
        userId: true,
        firstName: true,
        city: true,
        province: true,
        age: true,
        civilStatus: true,
        skills: true,
        employmentType: true,
        experience: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Add computed fields
    const enhancedProfiles = profiles.map(profile => ({
      ...profile,
      id: profile.userId,
      slug: generateEmployeeSlug(profile.firstName, profile.city, profile.userId),
      updatedAt: profile.updatedAt.toISOString(),
      availabilityDate: profile.availabilityDate?.toISOString(),
    }));

    return enhancedProfiles;
  } catch (error) {
    console.error('Error getting all public employee profiles:', error);
    return [];
  }
}

// Get employee profiles by location
export async function getEmployeeProfilesByLocation(city?: string, province?: string) {
  try {
    const whereClause: any = {
      visibility: true,
    };

    if (city) {
      whereClause.city = city;
    }

    if (province) {
      whereClause.province = province;
    }

    const profiles = await prisma.employeeProfile.findMany({
      where: whereClause,
      select: {
        userId: true,
        firstName: true,
        city: true,
        province: true,
        age: true,
        civilStatus: true,
        skills: true,
        employmentType: true,
        experience: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Add computed fields
    const enhancedProfiles = profiles.map(profile => ({
      ...profile,
      id: profile.userId,
      slug: generateEmployeeSlug(profile.firstName, profile.city, profile.userId),
      updatedAt: profile.updatedAt.toISOString(),
      availabilityDate: profile.availabilityDate?.toISOString(),
    }));

    return enhancedProfiles;
  } catch (error) {
    console.error('Error getting employee profiles by location:', error);
    return [];
  }
}

// Get employee profiles by skills
export async function getEmployeeProfilesBySkills(skills: string[]) {
  try {
    const profiles = await prisma.employeeProfile.findMany({
      where: {
        visibility: true,
        skills: {
          hasSome: skills,
        },
      },
      select: {
        userId: true,
        firstName: true,
        city: true,
        province: true,
        age: true,
        civilStatus: true,
        skills: true,
        employmentType: true,
        experience: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Add computed fields
    const enhancedProfiles = profiles.map(profile => ({
      ...profile,
      id: profile.userId,
      slug: generateEmployeeSlug(profile.firstName, profile.city, profile.userId),
      updatedAt: profile.updatedAt.toISOString(),
      availabilityDate: profile.availabilityDate?.toISOString(),
    }));

    return enhancedProfiles;
  } catch (error) {
    console.error('Error getting employee profiles by skills:', error);
    return [];
  }
}

// Get similar employee profiles
export async function getSimilarEmployeeProfiles(userId: string, limit: number = 5) {
  try {
    // Get the current profile
    const currentProfile = await prisma.employeeProfile.findUnique({
      where: { userId },
      select: {
        city: true,
        province: true,
        skills: true,
        employmentType: true,
        experience: true,
      },
    });

    if (!currentProfile) {
      return [];
    }

    // Find similar profiles
    const profiles = await prisma.employeeProfile.findMany({
      where: {
        userId: { not: userId },
        visibility: true,
        OR: [
          { city: currentProfile.city },
          { province: currentProfile.province },
          { employmentType: currentProfile.employmentType },
          {
            skills: {
              hasSome: currentProfile.skills,
            },
          },
        ],
      },
      select: {
        userId: true,
        firstName: true,
        city: true,
        province: true,
        age: true,
        civilStatus: true,
        skills: true,
        employmentType: true,
        experience: true,
        headline: true,
        availabilityDate: true,
        salaryMin: true,
        salaryMax: true,
        photoUrl: true,
        profileScore: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    // Add computed fields
    const enhancedProfiles = profiles.map(profile => ({
      ...profile,
      id: profile.userId,
      slug: generateEmployeeSlug(profile.firstName, profile.city, profile.userId),
      updatedAt: profile.updatedAt.toISOString(),
      availabilityDate: profile.availabilityDate?.toISOString(),
    }));

    return enhancedProfiles;
  } catch (error) {
    console.error('Error getting similar employee profiles:', error);
    return [];
  }
}

// Get employee profile statistics
export async function getEmployeeProfileStats() {
  try {
    const [
      totalProfiles,
      visibleProfiles,
      profilesByProvince,
      profilesByEmploymentType,
      averageExperience,
      averageSalary,
    ] = await Promise.all([
      prisma.employeeProfile.count(),
      prisma.employeeProfile.count({ where: { visibility: true } }),
      prisma.employeeProfile.groupBy({
        by: ['province'],
        where: { visibility: true },
        _count: { province: true },
        orderBy: { _count: { province: 'desc' } },
        take: 10,
      }),
      prisma.employeeProfile.groupBy({
        by: ['employmentType'],
        where: { visibility: true },
        _count: { employmentType: true },
      }),
      prisma.employeeProfile.aggregate({
        where: { visibility: true },
        _avg: { experience: true },
      }),
      prisma.employeeProfile.aggregate({
        where: { visibility: true },
        _avg: { 
          salaryMin: true,
          salaryMax: true,
        },
      }),
    ]);

    return {
      totalProfiles,
      visibleProfiles,
      profilesByProvince,
      profilesByEmploymentType,
      averageExperience: averageExperience._avg.experience || 0,
      averageSalary: {
        min: averageSalary._avg.salaryMin || 0,
        max: averageSalary._avg.salaryMax || 0,
      },
    };
  } catch (error) {
    console.error('Error getting employee profile statistics:', error);
    return {
      totalProfiles: 0,
      visibleProfiles: 0,
      profilesByProvince: [],
      profilesByEmploymentType: [],
      averageExperience: 0,
      averageSalary: { min: 0, max: 0 },
    };
  }
}
