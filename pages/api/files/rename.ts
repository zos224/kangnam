import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { oldPath, newName } = req.body;
  if (!oldPath || !newName) {
    return res.status(400).json({ error: 'Old path and new name are required' });
  }

  const rootDir = process.env.ROOT_DIR || process.cwd();
  const oldFullPath = path.join(rootDir, oldPath);
  const newFullPath = path.join(path.dirname(oldFullPath), newName);

  try {
    await fs.rename(oldFullPath, newFullPath);
    res.status(200).json({ message: 'File/folder renamed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename file/folder' });
  }
} 