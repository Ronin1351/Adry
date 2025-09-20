import { PrismaClient, Role, CivilStatus, SubscriptionStatus, InterviewStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@adry.com' },
    update: {},
    create: {
      email: 'admin@adry.com',
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  // Create sample employees
  const employees = await Promise.all([
    prisma.user.upsert({
      where: { email: 'maria.santos@example.com' },
      update: {},
      create: {
        email: 'maria.santos@example.com',
        name: 'Maria Santos',
        role: Role.EMPLOYEE,
        employeeProfile: {
          create: {
            civilStatus: CivilStatus.SINGLE,
            location: 'Quezon City, Metro Manila',
            phone: '+63 912 345 6789',
            skills: ['Cooking', 'Childcare', 'Laundry', 'Ironing', 'General Housekeeping'],
            experienceText: '5 years of experience in household management and childcare',
            salaryMin: 8000,
            salaryMax: 12000,
            liveIn: true,
            availabilityDate: new Date('2024-02-01'),
            daysOff: ['Sunday'],
            overtime: true,
            holidayWork: true,
            documents: {
              philid: { status: 'verified', number: '1234567890123' },
              philhealth: { status: 'verified', number: '12-345678901-2' },
              pagibig: { status: 'verified', number: '1234-5678-9012' },
            },
            visibility: true,
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'ana.cruz@example.com' },
      update: {},
      create: {
        email: 'ana.cruz@example.com',
        name: 'Ana Cruz',
        role: Role.EMPLOYEE,
        employeeProfile: {
          create: {
            civilStatus: CivilStatus.MARRIED,
            location: 'Makati City, Metro Manila',
            phone: '+63 917 123 4567',
            skills: ['Cooking', 'Elderly Care', 'General Housekeeping', 'Gardening'],
            experienceText: '8 years of experience in household management and elderly care',
            salaryMin: 10000,
            salaryMax: 15000,
            liveIn: false,
            availabilityDate: new Date('2024-01-15'),
            daysOff: ['Saturday', 'Sunday'],
            overtime: false,
            holidayWork: false,
            documents: {
              philid: { status: 'verified', number: '2345678901234' },
              philhealth: { status: 'verified', number: '23-456789012-3' },
              pagibig: { status: 'verified', number: '2345-6789-0123' },
            },
            visibility: true,
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'rosa.garcia@example.com' },
      update: {},
      create: {
        email: 'rosa.garcia@example.com',
        name: 'Rosa Garcia',
        role: Role.EMPLOYEE,
        employeeProfile: {
          create: {
            civilStatus: CivilStatus.SINGLE,
            location: 'Taguig City, Metro Manila',
            phone: '+63 918 765 4321',
            skills: ['Cooking', 'Laundry', 'Ironing', 'Cleaning'],
            experienceText: '3 years of experience in household cleaning and maintenance',
            salaryMin: 6000,
            salaryMax: 10000,
            liveIn: false,
            availabilityDate: new Date('2024-01-20'),
            daysOff: ['Sunday'],
            overtime: true,
            holidayWork: true,
            documents: {
              philid: { status: 'pending', number: '3456789012345' },
              philhealth: { status: 'verified', number: '34-567890123-4' },
              pagibig: { status: 'pending', number: '3456-7890-1234' },
            },
            visibility: true,
          },
        },
      },
    }),
  ]);

  // Create sample employers
  const employers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.smith@example.com' },
      update: {},
      create: {
        email: 'john.smith@example.com',
        name: 'John Smith',
        role: Role.EMPLOYER,
        employer: {
          create: {
            companyName: 'Smith Family',
            contactPhone: '+63 919 111 2222',
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.doe@example.com' },
      update: {},
      create: {
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        role: Role.EMPLOYER,
        employer: {
          create: {
            companyName: 'Doe Household',
            contactPhone: '+63 919 333 4444',
          },
        },
      },
    }),
  ]);

  // Create active subscription for first employer
  const subscription = await prisma.subscription.create({
    data: {
      employerId: employers[0].id,
      status: SubscriptionStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      provider: 'stripe',
      providerRef: 'sub_1234567890',
    },
  });

  // Create sample chats
  const chat1 = await prisma.chat.create({
    data: {
      employerId: employers[0].id,
      employeeId: employees[0].id,
    },
  });

  // Create sample messages
  await prisma.chatMessage.createMany({
    data: [
      {
        chatId: chat1.id,
        senderId: employers[0].id,
        body: 'Hello Maria! I saw your profile and I\'m interested in hiring you for our household.',
      },
      {
        chatId: chat1.id,
        senderId: employees[0].id,
        body: 'Hello Mr. Smith! Thank you for your interest. I would love to learn more about the position.',
      },
      {
        chatId: chat1.id,
        senderId: employers[0].id,
        body: 'Great! We need someone for live-in work, cooking, and childcare for our 2 children. Would you be available for an interview?',
      },
    ],
  });

  // Create sample interviews
  await prisma.interview.create({
    data: {
      employerId: employers[0].id,
      employeeId: employees[0].id,
      startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: InterviewStatus.SCHEDULED,
      notes: 'Initial interview for live-in housekeeper position',
    },
  });

  // Create sample shortlist
  await prisma.shortlist.create({
    data: {
      employerId: employers[0].id,
      employeeId: employees[1].id,
      notes: 'Experienced with elderly care, good for our needs',
    },
  });

  // Create sample search filters
  await prisma.searchFilter.create({
    data: {
      employerId: employers[0].id,
      name: 'Live-in Housekeepers in Metro Manila',
      filters: {
        location: ['Metro Manila'],
        employmentType: ['LIVE_IN'],
        skills: ['Cooking', 'Childcare'],
        salaryRange: { min: 8000, max: 15000 },
      },
      isDefault: true,
    },
  });

  // Create sample audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: 'CREATE',
        entity: 'USER',
        entityId: employees[0].id,
        meta: { role: 'EMPLOYEE', email: employees[0].email },
      },
      {
        actorId: employers[0].id,
        action: 'CREATE',
        entity: 'SUBSCRIPTION',
        entityId: subscription.id,
        meta: { provider: 'stripe', status: 'ACTIVE' },
      },
      {
        actorId: employers[0].id,
        action: 'CREATE',
        entity: 'CHAT',
        entityId: chat1.id,
        meta: { employeeId: employees[0].id },
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created ${employees.length} employees`);
  console.log(`🏢 Created ${employers.length} employers`);
  console.log(`💳 Created 1 active subscription`);
  console.log(`💬 Created 1 chat with messages`);
  console.log(`📅 Created 1 scheduled interview`);
  console.log(`⭐ Created 1 shortlist entry`);
  console.log(`🔍 Created 1 search filter`);
  console.log(`📝 Created ${3} audit log entries`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
