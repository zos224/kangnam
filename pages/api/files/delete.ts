import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filePath = req.query.path as string;
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const fullPath = path.join(process.env.ROOT_DIR || process.cwd(), filePath);

  try {
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }

    res.status(200).json({ message: 'File/folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file/folder' });
  }
} 