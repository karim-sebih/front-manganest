import instance from "./config.js";

async function createComment(data) {
    const res = await instance.post("/comments", data);
    return res.data;
}

async function getCommentsByManga(mangaId) {
    const res = await instance.get(`/comments/manga/${mangaId}`);
    return res.data;
}

async function getCommentsByChapter(chapterId) {
    const res = await instance.get(`/comments/chapter/${chapterId}`);
    return res.data;
}

async function deleteComment(commentId) {
    const res = await instance.delete(`/comments/${commentId}`);
    return res.data;
}


async function updateComment(commentId, content) {
    const res = await instance.put(`/comments/${commentId}`, { content });
    return res.data;
}

export {
    createComment,
    getCommentsByManga,
    getCommentsByChapter,
    deleteComment,
    updateComment,
};
