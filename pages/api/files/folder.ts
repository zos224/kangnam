import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { path: folderPath, name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  const fullPath = path.join(process.env.ROOT_DIR || process.cwd(), folderPath || '', name);

  try {
    // Kiểm tra xem folder đã tồn tại chưa
    try {
      await fs.access(fullPath);
      return res.status(400).json({ error: 'Folder already exists' });
    } catch {
      // Folder chưa tồn tại, tiếp tục tạo mới
    }

    await fs.mkdir(fullPath, { recursive: true });
    res.status(200).json({ message: 'Folder created successfully' });
  } catch (error) {
    console.error('Failed to create folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
} 