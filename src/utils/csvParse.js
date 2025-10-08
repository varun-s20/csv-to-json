import "../../env.js"
import fs from "fs/promises";
import path from 'path';

// Check if CSV_FILE_PATH environment variable is defined
const csvFilePathEnv = process.env.CSV_FILE_PATH;
console.log("csvFilePathEnv", csvFilePathEnv);
if (!csvFilePathEnv) {
  throw new Error('Environment variable CSV_FILE_PATH is not defined');
}

// Resolve the path of the CSV file from environment variables
const csvFilePath = path.resolve(process.cwd(), csvFilePathEnv);

// Function to parse the CSV file
const parseCSV = async () => {
  try {
    // Read the CSV file asynchronously
    const fileContent = await fs.readFile(csvFilePath, 'utf-8');
    
    // Split the file content into lines
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    // Extract headers from the first line
    const headers = lines[0].split(',').map(header => header.trim());

    // Process each line after the header
    const records = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      const record = {};

      headers.forEach((header, index) => {
        record[header] = values[index];
      });

      return record;
    });

    return records;
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    throw error;
  }
};

export default parseCSV;
