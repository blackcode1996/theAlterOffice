import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    text: string;
    authorId: mongoose.Schema.Types.ObjectId;
    parentCommentId?: mongoose.Schema.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
    {
        postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
        text: { type: String, required: true },
        authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    },
    { timestamps: true }
);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
