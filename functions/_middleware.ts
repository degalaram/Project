// Cloudflare Pages middleware for SPA routing and API proxying
export const onRequest = async (context: any) => {
  const url = new URL(context.request.url);
  const { request } = context;
  
  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, user-id',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // Proxy API routes to Render backend
  if (url.pathname.startsWith('/api/')) {
    const backendUrl = (context.env.BACKEND_URL || 'https://project-1-yxba.onrender.com') + url.pathname + url.search;
    
    const backendRequest = new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : undefined,
    });
    
    try {
      const response = await fetch(backendRequest);
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, user-id',
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Backend unavailable' }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
  
  // Skip other assets
  if (url.pathname.startsWith('/assets') || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return context.next();
  }
  
  // For all other routes, serve index.html (SPA routing)
  return context.env.ASSETS.fetch(new URL('/index.html', url.origin));
};
