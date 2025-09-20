import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { employeeSearchFilterSchema } from '@/lib/validations/employee-profile';
import { z } from 'zod';

// GET /api/employee-profile/search - Search employee profiles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const queryParams = {
      location: searchParams.get('location'),
      skills: searchParams.get('skills')?.split(',').filter(Boolean),
      employmentType: searchParams.get('employmentType')?.split(',').filter(Boolean),
      salaryMin: searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
      salaryMax: searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
      experienceMin: searchParams.get('experienceMin') ? parseInt(searchParams.get('experienceMin')!) : undefined,
      experienceMax: searchParams.get('experienceMax') ? parseInt(searchParams.get('experienceMax')!) : undefined,
      availabilityDate: searchParams.get('availabilityDate') ? new Date(searchParams.get('availabilityDate')!) : undefined,
      kycStatus: searchParams.get('kycStatus')?.split(',').filter(Boolean),
      visibility: searchParams.get('visibility') === 'true',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    // Validate query parameters
    const validatedParams = employeeSearchFilterSchema.parse(queryParams);

    // Build where clause
    const where: any = {
      visibility: true, // Only show visible profiles
    };

    // Location filter
    if (validatedParams.location) {
      where.OR = [
        { city: { contains: validatedParams.location, mode: 'insensitive' } },
        { province: { contains: validatedParams.location, mode: 'insensitive' } },
      ];
    }

    // Skills filter
    if (validatedParams.skills && validatedParams.skills.length > 0) {
      where.skills = {
        hasSome: validatedParams.skills,
      };
    }

    // Employment type filter
    if (validatedParams.employmentType && validatedParams.employmentType.length > 0) {
      where.employmentType = {
        in: validatedParams.employmentType,
      };
    }

    // Salary range filter
    if (validatedParams.salaryMin !== undefined || validatedParams.salaryMax !== undefined) {
      where.AND = [];
      
      if (validatedParams.salaryMin !== undefined) {
        where.AND.push({
          salaryMin: { lte: validatedParams.salaryMin },
        });
      }
      
      if (validatedParams.salaryMax !== undefined) {
        where.AND.push({
          salaryMax: { gte: validatedParams.salaryMax },
        });
      }
    }

    // Experience range filter
    if (validatedParams.experienceMin !== undefined || validatedParams.experienceMax !== undefined) {
      if (!where.AND) where.AND = [];
      
      if (validatedParams.experienceMin !== undefined) {
        where.AND.push({
          experience: { gte: validatedParams.experienceMin },
        });
      }
      
      if (validatedParams.experienceMax !== undefined) {
        where.AND.push({
          experience: { lte: validatedParams.experienceMax },
        });
      }
    }

    // Availability date filter
    if (validatedParams.availabilityDate) {
      where.availabilityDate = {
        lte: validatedParams.availabilityDate,
      };
    }

    // KYC status filter
    if (validatedParams.kycStatus && validatedParams.kycStatus.length > 0) {
      where.kycStatus = {
        in: validatedParams.kycStatus,
      };
    }

    // Build order by clause
    const orderBy: any = {};
    if (validatedParams.sortBy === 'salaryMin') {
      orderBy.salaryMin = validatedParams.sortOrder;
    } else if (validatedParams.sortBy === 'salaryMax') {
      orderBy.salaryMax = validatedParams.sortOrder;
    } else if (validatedParams.sortBy === 'experience') {
      orderBy.experience = validatedParams.sortOrder;
    } else if (validatedParams.sortBy === 'profileScore') {
      orderBy.profileScore = validatedParams.sortOrder;
    } else {
      orderBy.createdAt = validatedParams.sortOrder;
    }

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;

    // Execute query
    const [profiles, totalCount] = await Promise.all([
      prisma.employeeProfile.findMany({
        where,
        orderBy,
        skip,
        take: validatedParams.limit,
        select: {
          userId: true,
          firstName: true,
          age: true,
          civilStatus: true,
          city: true,
          province: true,
          skills: true,
          experience: true,
          headline: true,
          salaryMin: true,
          salaryMax: true,
          employmentType: true,
          availabilityDate: true,
          daysOff: true,
          overtime: true,
          holidayWork: true,
          profileScore: true,
          kycStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.employeeProfile.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / validatedParams.limit);
    const hasNextPage = validatedParams.page < totalPages;
    const hasPreviousPage = validatedParams.page > 1;

    return NextResponse.json({
      profiles,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      filters: validatedParams,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error searching employee profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
