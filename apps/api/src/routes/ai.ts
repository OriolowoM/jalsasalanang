import { Router, Request, Response } from 'express';
import { askJalsaAI, generateArticleSEO, checkEditorialPolish } from '../services/ai';
import { authenticate } from '../middleware/auth';

export const aiRouter = Router();

// POST /api/v1/ai/ask — Public "Ask Jalsa AI" Assistant
aiRouter.post('/ask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide a search or question query.' });
      return;
    }

    const result = await askJalsaAI(query);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error processing AI request.', error: err.message });
  }
});

// POST /api/v1/ai/generate-metadata — CMS Author Assistance (Requires Auth)
aiRouter.post('/generate-metadata', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Title and content are required.' });
      return;
    }

    const metadata = await generateArticleSEO(title, content);
    res.json({
      success: true,
      data: metadata,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate SEO metadata.', error: err.message });
  }
});

// POST /api/v1/ai/polish — CMS Editorial Quality Check
aiRouter.post('/polish', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ success: false, message: 'Content is required.' });
      return;
    }

    const report = await checkEditorialPolish(content);
    res.json({
      success: true,
      data: report,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to run editorial polish.', error: err.message });
  }
});
