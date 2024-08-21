import Post from '../models/Post.modal';

export const createPost = async (title: string, content: string, authorId: string) => {
    const post = await Post.create({ title, content, authorId });
    return post;
};

export const getPosts = async () => {
    const posts = await Post.find();
    return posts;
};

export const getPostById = async (postId: string) => {
    const post = await Post.findById(postId);
    return post;
};
