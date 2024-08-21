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
export const replyToComment = async (postId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId, text: string, userId: mongoose.Types.ObjectId) => {
    try {
        const newReply = new Comment({
            postId,
            text,
            userId,
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
export const expandComments = async (postId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId, page: number, pageSize: number) => {
   console.log({postId});
   console.log({commentId});
   console.log(await Comment.find({postId, commentId }));
    try {
        const comments = await Comment.find({ postId, commentId })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();
        return comments;
    } catch (error: any) {
        throw new Error(`Error expanding comments: ${error.message}`);
    }
};
