import express from 'express';
import { getPageSpeedReport } from '../controllers/pagespeedController.js';

const router = express.Router();

router.get('/', getPageSpeedReport);

export default router;
