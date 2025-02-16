import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rootDir = process.env.ROOT_DIR || process.cwd();
  
  switch (req.method) {
    case 'GET':
      try {
        const currentPath = (req.query.path as string) || '';
        const fullPath = path.join(rootDir, currentPath);
        
        const items = await fs.readdir(fullPath, { withFileTypes: true });
        
        const fileList = await Promise.all(
          items.map(async (item) => {
            const itemPath = path.join(currentPath, item.name);
            const stats = await fs.stat(path.join(rootDir, itemPath));
            
            return {
              id: Buffer.from(itemPath).toString('base64'),
              name: item.name,
              type: item.isDirectory() ? 'folder' : 'file',
              size: item.isFile() ? stats.size : undefined,
              path: itemPath,
              createdAt: stats.birthtime,
              updatedAt: stats.mtime,
              extension: item.isFile() ? path.extname(item.name).slice(1) : undefined
            };
          })
        );

        res.status(200).json(fileList);
      } catch (error) {
        res.status(500).json({ error: 'Failed to read directory' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 