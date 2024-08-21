import express from 'express';
import { createPost, getPosts } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';
import { postRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.use(protect)

// Create Post
router.post('/', postRateLimiter, createPost);

// Get All Posts
router.get('/:postId?', getPosts);


export default router;
