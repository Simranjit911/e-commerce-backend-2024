import fs from 'fs/promises';
import path from 'path';
let cd = process.cwd()
// console.log(cd)

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const folderName = 'tmp'; // Change 'tmp' to the name of your folder
const folderPath = path.join(cd, folderName);
console.log(folderPath)

const deleteAllFilesInDirectory = async () => {
    try {
        // Check if the directory exists
        const directoryExists = await fs.stat(folderPath);
        if (!directoryExists.isDirectory()) {
            throw new Error(`Path '${folderPath}' is not a directory.`);
        }

        // Read all files in the directory
        const files = await fs.readdir(folderPath);

        if (files.length === 0) {
            console.log(`No files found in directory '${folderPath}'.`);
            return;
        }

        // Delete all files in the directory
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(folderPath, file);
            await fs.unlink(filePath);
            console.log(`File '${filePath}' has been deleted.`);
        }));

        console.log(`All files in directory '${folderPath}' have been deleted.`);
    } catch (error) {
        console.error(`Error deleting files in directory '${folderPath}':`, error);
    }
};
// deleteAllFilesInDirectory()
export default deleteAllFilesInDirectory;
