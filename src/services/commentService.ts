import Comment from '../models/Comment.modal'; 
import mongoose from 'mongoose';

// Create Comment
export const createComment = async (postId: mongoose.Types.ObjectId, text: string, authorId: mongoose.Types.ObjectId) => {
    try {
        const newComment = new Comment({
            postId,
            text,
            authorId,
        });
        await newComment.save();
        return { newComment, message: 'Comment created successfully' };
    } catch (error: any) {
        throw new Error(`Error creating comment: ${error.message}`);
    }
};

// Reply to Existing Comment
export const replyToComment = async (postId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId, text: string, authorId: mongoose.Types.ObjectId) => {

    try {
        const newReply = new Comment({
            postId,
            text,
            authorId,
            parentCommentId: commentId
        });
        await newReply.save();
        return { newReply, message: 'Reply created successfully' };
    } catch (error: any) {
        throw new Error(`Error replying to comment: ${error.message}`);
    }
};

// Get Comments for a Post
export const getCommentsForPost = async (postId: mongoose.Types.ObjectId, sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'asc', filterBy: any = {}) => {
    try {
        const comments = await Comment.find({ postId, ...filterBy })
            .sort({ [sortBy]: sortOrder })
            .exec();
        return comments;
    } catch (error: any) {
        throw new Error(`Error retrieving comments: ${error.message}`);
    }
};

// Expand Parent-Level Comments with Pagination
export const expandComments = async (
    postId: mongoose.Types.ObjectId,
    commentId: mongoose.Types.ObjectId,
    page: number,
    pageSize: number
) => {
    const skip = (page - 1) * pageSize;

    const comments = await Comment.find({
        postId: postId,
        parentCommentId: commentId,
    })
        .skip(skip)
        .limit(pageSize)
        .populate({
            path: 'replies',
            options: { limit: 2, sort: { createdAt: -1 } }, 
            select: 'text createdAt', 
        })
        .populate('postId', '_id') 
        .populate('parentCommentId', '_id') 
        .populate('authorId', 'username')
        .exec();

    const totalReplies = await Comment.countDocuments({ parentCommentId: commentId });

    return { comments, totalReplies };
};