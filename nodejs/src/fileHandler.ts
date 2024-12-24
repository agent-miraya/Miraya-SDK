// fileHandler.js
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const readFileNode = async () => {
  try {
    const filePath = join(__dirname, 'actions', 'solana-agent-kit.js');
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error: any) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

export const readFileBrowser = async () => {
  try {
    const response = await fetch('/actions/solana-agent-kit.js');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return content;
  } catch (error: any) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

export const readFile = async () => {
  // Check if we're in Node.js environment
  if (typeof window === 'undefined') {
    return readFileNode();
  } else {
    return readFileBrowser();
  }
};

const loadSolanaKit = async () => {
  try {
    const content = await readFileNode();
    return content;
  } catch (error: any) {
    console.error('Failed to load Solana Agent Kit:', error.message);
    throw error;
  }
};

export default loadSolanaKit;