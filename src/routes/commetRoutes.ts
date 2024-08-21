import express from 'express';
import {createComment, replyToComment, getCommentsForPost, expandComments}from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware'; 
import { postRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Middleware to authenticate all routes
router.use(protect);

// Create Comment
router.post('/:postId/comments',postRateLimiter, createComment);

// Reply to Existing Comment
router.post('/:postId/comments/:commentId/reply',postRateLimiter, replyToComment);

// Get Comments for a Post
router.get('/:postId/comments', getCommentsForPost);

// Expand Parent-Level Comments with Pagination
router.get('/:postId/comments/:commentId/expand', expandComments);

export default router;
