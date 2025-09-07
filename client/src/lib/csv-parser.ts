export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCSV(csvText: string): CSVData {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  return { headers, rows };
}

export function validateCSVData(data: CSVData): boolean {
  return data.headers.length > 0 && data.rows.length > 0;
}

export function generateSampleData(type: 'ecommerce' | 'marketing' | 'financial'): CSVData {
  switch (type) {
    case 'ecommerce':
      return {
        headers: ['Product', 'Sales', 'Revenue', 'Category'],
        rows: [
          { Product: 'Pro Dashboard', Sales: '150', Revenue: '12450', Category: 'Software' },
          { Product: 'Analytics Suite', Sales: '98', Revenue: '8230', Category: 'Software' },
          { Product: 'Data Connector', Sales: '73', Revenue: '5890', Category: 'Tools' },
          { Product: 'Mobile App', Sales: '120', Revenue: '9600', Category: 'Software' },
        ]
      };
    case 'marketing':
      return {
        headers: ['Channel', 'Impressions', 'Clicks', 'Conversions', 'Cost'],
        rows: [
          { Channel: 'Google Ads', Impressions: '50000', Clicks: '2500', Conversions: '125', Cost: '5000' },
          { Channel: 'Facebook', Impressions: '75000', Clicks: '3750', Conversions: '187', Cost: '3500' },
          { Channel: 'LinkedIn', Impressions: '25000', Clicks: '1250', Conversions: '75', Cost: '2500' },
          { Channel: 'Email', Impressions: '15000', Clicks: '900', Conversions: '90', Cost: '500' },
        ]
      };
    case 'financial':
      return {
        headers: ['Month', 'Revenue', 'Expenses', 'Profit', 'Growth'],
        rows: [
          { Month: 'Jan', Revenue: '125000', Expenses: '85000', Profit: '40000', Growth: '12' },
          { Month: 'Feb', Revenue: '138000', Expenses: '92000', Profit: '46000', Growth: '15' },
          { Month: 'Mar', Revenue: '142000', Expenses: '89000', Profit: '53000', Growth: '18' },
          { Month: 'Apr', Revenue: '155000', Expenses: '95000', Profit: '60000', Growth: '22' },
        ]
      };
    default:
      throw new Error('Unknown sample data type');
  }
}
