import instance from "./config.js";

async function createOrUpdateRating(mangaId, rating) {
    try {
        const response = await instance.post("/ratings", { mangaId, rating });
        return response.data;
    } catch (error) {
        console.error("Error creating/updating rating:", error);
        throw error;
    }
}

async function getRatingsByManga(mangaId, rating) {
    try {
        const response = await instance.get(`/ratings/manga/${mangaId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ratings:", error);
        throw error;
    }
}

async function deleteRating(mangaId) {
    try {
        const response = await instance.delete(`/ratings/manga/${mangaId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting rating:", error);
        throw error;
    }
}

export { createOrUpdateRating, getRatingsByManga, deleteRating };