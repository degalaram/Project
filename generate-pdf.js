
import puppeteer from 'puppeteer';
import fs from 'fs';
import { marked } from 'marked';

async function generatePDF() {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync('JobPortal_Complete_Presentation.md', 'utf8');
    
    // Convert markdown to HTML
    const htmlContent = marked(markdownContent);
    
    // Create full HTML document
    const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>JobPortal Presentation</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          color: #333;
        }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1d4ed8; }
        .page-break { page-break-before: always; }
        code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f9fafb; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #2563eb; margin: 0; padding-left: 20px; font-style: italic; }
        .emoji { font-size: 1.2em; }
        hr { border: none; border-top: 2px solid #e5e7eb; margin: 40px 0; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>`;
    
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
      path: 'JobPortal_Complete_Presentation.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    await browser.close();
    console.log('✅ PDF generated successfully: JobPortal_Complete_Presentation.pdf');
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  }
}

generatePDF();
