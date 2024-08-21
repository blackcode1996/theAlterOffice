
import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, authorId } = req.body;

        const post = await postService.createPost(title, content, authorId);

        res.status(201).json({
            post,
            message: 'Post created successfully',
        });
    } catch (error) {
        next(error);
    }
};


export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    try {
        if (postId) {
            const post = await postService.getPostById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(post);
        } else {
            const posts = await postService.getPosts();
            return res.status(200).json({
                count: posts.length,
                posts,
            });
        }
    } catch (error) {
        next(error);
    }
};
