import { NextResponse } from 'next/server';

export async function checkSubscriptionAccess(userId: string) {
  // TODO: Implement subscription check
  return { hasAccess: true, canMessage: true, canSchedule: true };
}

export function paywallMiddleware() {
  return NextResponse.next();
}
