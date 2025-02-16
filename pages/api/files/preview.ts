import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filePath = req.query.path as string;
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const fullPath = path.join(process.env.ROOT_DIR || process.cwd(), filePath);

  try {
    const stat = await fs.promises.stat(fullPath);
    if (!stat.isFile()) {
      return res.status(400).json({ error: 'Path is not a file' });
    }

    const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
    const isText = mimeType.startsWith('text/') || 
      ['application/json', 'application/javascript'].includes(mimeType);

    if (isText) {
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      res.send(content);
    } else {
      const fileStream = fs.createReadStream(fullPath);
      res.setHeader('Content-Type', mimeType);
      fileStream.pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to preview file' });
  }
} 