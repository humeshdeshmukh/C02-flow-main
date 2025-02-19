import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min';
import Tesseract from 'tesseract.js';
import * as XLSX from 'xlsx';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const parseFile = async (file) => {
  const fileType = file.type;
  let extractedData = null;

  try {
    switch (true) {
      case fileType.includes('pdf'):
        extractedData = await parsePDF(file);
        break;
      case fileType.includes('image'):
        extractedData = await parseImage(file);
        break;
      case fileType.includes('excel') || fileType.includes('spreadsheet'):
        extractedData = await parseExcel(file);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    return processExtractedData(extractedData);
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
};

// PDF Parser
const parsePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map(item => item.str).join(' ');
    }

    return extractedText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
};

// Image Parser (OCR)
const parseImage = async (file) => {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: info => console.log(info),
    });
    return result.data.text;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to perform OCR');
  }
};

// Excel Parser
const parseExcel = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstSheet);
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error('Failed to parse Excel file');
  }
};

// Process extracted data to find emission-related information
const processExtractedData = (rawData) => {
  const emissionData = {
    fuelConsumption: null,
    electricityUsage: null,
    businessTravel: null,
  };

  // Pattern matching for different types of data
  const patterns = {
    fuelConsumption: /fuel.consumption.*?(\d+\.?\d*)/i,
    electricityUsage: /electricity.usage.*?(\d+\.?\d*)/i,
    businessTravel: /business.travel.*?(\d+\.?\d*)/i,
  };

  if (typeof rawData === 'string') {
    // Process text data from PDF or OCR
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = rawData.match(pattern);
      if (match && match[1]) {
        emissionData[key] = parseFloat(match[1]);
      }
    });
  } else if (Array.isArray(rawData)) {
    // Process structured data from Excel
    rawData.forEach(row => {
      Object.keys(emissionData).forEach(key => {
        if (row[key] !== undefined) {
          emissionData[key] = parseFloat(row[key]);
        }
      });
    });
  }

  return emissionData;
};

export default {
  parseFile,
};
