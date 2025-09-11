// Cloudflare Workers function to proxy API requests to Render backend
export const onRequest = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Get the API path (everything after /api)
  const apiPath = url.pathname.replace('/api', '') || '/';
  const queryString = url.search;
  
  // Your Render backend URL - UPDATE THIS TO YOUR ACTUAL RENDER URL
  const backendUrl = `https://jobportall1.onrender.com/api${apiPath}${queryString}`;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Create the backend request
    const backendRequest = new Request(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'Accept': 'application/json',
        // Forward other important headers
        ...(request.headers.get('Authorization') && {
          'Authorization': request.headers.get('Authorization')
        }),
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });

    // Make the request to Render backend
    const response = await fetch(backendRequest);
    
    // Get response content
    const responseBody = await response.text();
    
    // Create response with CORS headers
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
    
  } catch (error) {
    console.error('API Proxy Error:', error);
    
    return new Response(JSON.stringify({
      error: 'API request failed',
      message: error.message,
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
};
