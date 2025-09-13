
// Cloudflare Pages middleware for SPA routing and API proxying
export const onRequest = async (context: any) => {
  const url = new URL(context.request.url);
  const { request } = context;
  
  console.log('🔧 Cloudflare middleware:', {
    method: request.method,
    pathname: url.pathname,
    origin: url.origin
  });
  
  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS') {
    console.log('✈️ Handling CORS preflight');
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
    console.log('🔄 Proxying API request to:', backendUrl);
    
    const backendRequest = new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : undefined,
    });
    
    try {
      const response = await fetch(backendRequest);
      console.log('✅ Backend response status:', response.status);
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
      console.error('❌ Backend request failed:', error);
      return new Response(JSON.stringify({ 
        error: 'Backend unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
  
  // For all other requests, let Cloudflare Pages handle them
  console.log('📄 Letting Cloudflare Pages handle:', url.pathname);
  return context.next();
};
