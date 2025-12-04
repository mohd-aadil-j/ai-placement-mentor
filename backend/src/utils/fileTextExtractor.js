import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

let mammoth;
try {
  // Lazy require to avoid crash if not installed (PDF and TXT still work)
  mammoth = await import('mammoth');
} catch (e) {
  mammoth = null;
}

const MAX_CHARS = 15000; // safety limit

export async function extractTextFromFile(filePath, mimetype, originalname) {
  const ext = path.extname(originalname || '').toLowerCase();

  try {
    if (mimetype === 'text/plain' || ext === '.txt') {
      const content = fs.readFileSync(filePath, 'utf8');
      return truncate(content);
    }

    if (mimetype === 'application/pdf' || ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return truncate(data.text || '');
    }

    if ((mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx') && mammoth) {
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return truncate(result.value || '');
    }

    // Fallback: try reading as utf8
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return truncate(content);
    } catch (e) {
      return '';
    }
  } catch (error) {
    return '';
  }
}

function truncate(text) {
  if (!text) return '';
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS) + '\n... [truncated]';
}
