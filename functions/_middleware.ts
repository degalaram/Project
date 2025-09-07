// This file ensures proper routing for SPA on Cloudflare Pages
export const onRequest = async (context: any) => {
  const url = new URL(context.request.url);
  
  // Skip API routes and static assets
  if (url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/assets') || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return context.next();
  }
  
  // For all other routes, serve index.html (SPA routing)
  return context.env.ASSETS.fetch(new URL('/index.html', url.origin));
};
