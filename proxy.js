import { NextResponse } from 'next/server';

import {
  buildDashboardLoginRedirect,
  DASHBOARD_SESSION_COOKIE,
  shouldProtectDashboardPath,
  verifyDashboardSessionTokenForMiddleware,
} from './lib/dashboard-middleware-auth.mjs';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!shouldProtectDashboardPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
  const session = await verifyDashboardSessionTokenForMiddleware(token);

  if (!session) {
    return NextResponse.redirect(buildDashboardLoginRedirect(request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
