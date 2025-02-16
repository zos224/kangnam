import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    uploadDir: process.env.ROOT_DIR || process.cwd(),
    keepExtensions: true,
  });

  form.parse(req, async (err: any, fields: Fields<string>, files: Files<"file">) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const currentPath = Array.isArray(fields.path) ? fields.path[0] : (fields.path || '');
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const targetPath = path.join(
        process.env.ROOT_DIR || process.cwd(),
        currentPath,
        uploadedFile.originalFilename || uploadedFile.newFilename
      );

      await fs.promises.rename(uploadedFile.filepath, targetPath);

      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save file' });
    }
  });
} 