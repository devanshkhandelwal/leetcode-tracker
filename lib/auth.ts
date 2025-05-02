import { getSession as getAuth0Session } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function getSession(request: NextRequest) {
  const response = new NextResponse();
  const session = await getAuth0Session(request, response);
  return session;
} 