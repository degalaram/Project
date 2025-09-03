
import puppeteer from 'puppeteer';
import fs from 'fs';
import { marked } from 'marked';

async function generatePDF() {
  try {
    console.log('🚀 Starting PDF generation...');
    
    // Read the markdown file
    const markdownContent = fs.readFileSync('JobPortal_Complete_Presentation.md', 'utf8');
    console.log('📖 Markdown file loaded successfully');
    
    // Convert markdown to HTML
    const htmlContent = marked.parse(markdownContent);
    console.log('🔄 Converted markdown to HTML');
    
    // Create full HTML document with better styling for PDF
    const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>JobPortal Complete Presentation</title>
      <style>
        @page {
          margin: 1in;
          size: A4;
        }
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #333;
          font-size: 14px;
        }
        h1 { 
          color: #2563eb; 
          border-bottom: 3px solid #2563eb; 
          padding-bottom: 10px; 
          page-break-before: auto;
          font-size: 28px;
          margin-top: 20px;
        }
        h2 { 
          color: #1e40af; 
          margin-top: 30px; 
          font-size: 22px;
          page-break-after: avoid;
        }
        h3 { 
          color: #1d4ed8; 
          font-size: 18px;
        }
        .page-break { 
          page-break-before: always; 
        }
        code { 
          background: #f3f4f6; 
          padding: 2px 4px; 
          border-radius: 3px; 
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }
        pre { 
          background: #f9fafb; 
          padding: 15px; 
          border-radius: 5px; 
          overflow-x: auto; 
          border-left: 4px solid #2563eb;
          font-size: 12px;
        }
        blockquote { 
          border-left: 4px solid #2563eb; 
          margin: 0; 
          padding-left: 20px; 
          font-style: italic; 
          background: #f8fafc;
          padding: 15px 20px;
        }
        hr { 
          border: none; 
          border-top: 2px solid #e5e7eb; 
          margin: 30px 0; 
          page-break-after: always;
        }
        img { 
          max-width: 100%; 
          height: auto; 
          page-break-inside: avoid;
        }
        ul, ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        li {
          margin: 5px 0;
        }
        .emoji {
          font-size: 1.2em;
        }
        p {
          margin: 10px 0;
          text-align: justify;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>`;
    
    console.log('🎨 HTML template created with styling');
    
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    console.log('🌐 Browser launched successfully');
    
    const page = await browser.newPage();
    await page.setContent(fullHTML, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('📄 Page content loaded');
    
    // Generate PDF with better options
    await page.pdf({
      path: 'JobPortal_Complete_Presentation.pdf',
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 10px; margin: 0 auto; color: #666;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully: JobPortal_Complete_Presentation.pdf');
    console.log('📁 File saved in the root directory');
    
    // Check if file exists and show size
    const stats = fs.statSync('JobPortal_Complete_Presentation.pdf');
    console.log(`📊 PDF file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Run the function
generatePDF();
