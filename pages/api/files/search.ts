import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

async function searchFiles(dir: string, query: string): Promise<any[]> {
  const results = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(process.env.ROOT_DIR || process.cwd(), fullPath);

    if (item.name.toLowerCase().includes(query.toLowerCase())) {
      const stats = await fs.stat(fullPath);
      results.push({
        id: Buffer.from(relativePath).toString('base64'),
        name: item.name,
        type: item.isDirectory() ? 'folder' : 'file',
        size: item.isFile() ? stats.size : undefined,
        path: relativePath,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
        extension: item.isFile() ? path.extname(item.name).slice(1) : undefined
      });
    }

    if (item.isDirectory()) {
      results.push(...await searchFiles(fullPath, query));
    }
  }

  return results;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.query.query as string;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await searchFiles(process.env.ROOT_DIR || process.cwd(), query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search files' });
  }
} 