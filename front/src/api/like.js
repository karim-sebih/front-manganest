import instance from "./config.js";

async function getLikesByChapter(chapterId) {
    try {
        const response = await instance.get(`/likes/chapter/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching likes:", error);
        throw error;
    }
}

async function addLike(chapterId) {
    try {
        const response = await instance.post(`/likes/chapter/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error("Error adding like:", error);
        throw error;
    }
}

async function removeLike(chapterId) {
    try {
        const response = await instance.delete(`/likes/chapter/${chapterId}`);
        return response.data;
    }
    catch (error) {
        console.error("Error removing like:", error);
        throw error;
    }
}

export { getLikesByChapter, addLike, removeLike };