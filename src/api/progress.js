import instance from './config.js';

async function saveProgress(mangadex_id, data) {
    try {
        const response = await instance.post(`/progress`, {
            mangadex_id,
            mangadex_chapter_id: data.mangadex_chapter_id,
            page: data.page
        });

        return response.data;
    } catch (error) {
        console.error("Error saving progress:", error);
        throw error;
    }
}

async function getProgress(mangadex_id) {
    try {
        const response = await instance.get(`/progress/${mangadex_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching progress:", error);
        throw error;
    }
}

async function getAllProgress() {
    try {
        const response = await instance.get("/progress");
        return response.data;
    } catch (error) {
        console.error("Error fetching progress list:", error);
        throw error;
    }
}



export { saveProgress, getProgress, getAllProgress };
