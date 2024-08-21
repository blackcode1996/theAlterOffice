import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';
import mongoose from 'mongoose';

export const createComment = async (req: Request, res: Response, next: Function) => {
    const { postId } = req.params;
    const postIdobj = new mongoose.Types.ObjectId(postId);
    const { text, authorId } = req.body;
    try {
        const result = await commentService.createComment(postIdobj, text, authorId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const replyToComment = async (req: Request, res: Response, next: Function) => {
    const { postId, commentId } = req.params;
    const postIdobj = new mongoose.Types.ObjectId(postId);
    const commentIdobj = new mongoose.Types.ObjectId(commentId);
    const { text, authorId } = req.body;
    try {
        const result = await commentService.replyToComment(postIdobj, commentIdobj, text, authorId);
        res.status(201).json(result);
    } catch (error) {
        next(error); 
    }
};

export const getCommentsForPost = async (req: Request, res: Response, next: NextFunction) => {
    const postIdParam = req.params.postId;
    const { sortBy, sortOrder, filterBy } = req.query;

    try {
        const postId = new mongoose.Types.ObjectId(postIdParam);

        const comments = await commentService.getCommentsForPost(
            postId,
            sortBy as string,
            sortOrder as 'asc' | 'desc',
            filterBy ? JSON.parse(filterBy as string) : {}
        );
        res.status(200).json({ comments });
    } catch (error) {
        next(error);
    }
};

export const expandComments = async (req: Request, res: Response, next: Function) => {
    const { postId, commentId } = req.params;
    console.log({ postId });
    console.log({ commentId });
    const { page, pageSize } = req.query;
    try {
        const postIdobj = new mongoose.Types.ObjectId(postId);
        const commentIdobj = new mongoose.Types.ObjectId(commentId);

        const comments = await commentService.expandComments(
            postIdobj,
            commentIdobj,
            parseInt(page as string, 10),
            parseInt(pageSize as string, 10)
        );

        console.log({ comments });
        res.status(200).json({ comments });
    } catch (error) {
        next(error);
    }
};