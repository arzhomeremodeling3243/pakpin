import { NextResponse } from 'next/server'

// TEMPORARY maintenance page (owner order 2026-10-29): shows a
// "coming back soon" page for every route while PakPin work is
// paused. Reverting = deleting this one file; no other code is
// touched, and the full site returns on the next deploy.
const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>PakPin — Coming Back Soon</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #172554; font-family: system-ui, -apple-system, sans-serif; color: #fff; text-align: center; padding: 24px; }
  .card { max-width: 520px; }
  .pin { font-size: 56px; }
  h1 { font-size: 34px; margin: 12px 0 8px; }
  p { color: #bfdbfe; font-size: 16px; line-height: 1.6; margin: 0; }
  .dot { color: #f43f5e; }
</style>
</head>
<body>
  <div class="card">
    <div class="pin">📍</div>
    <h1>PakPin<span class="dot">.</span></h1>
    <p>Coming back soon.<br />We&apos;re working on something better — please check back soon.</p>
  </div>
</body>
</html>`

export function middleware() {
  return new NextResponse(HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '86400',
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
