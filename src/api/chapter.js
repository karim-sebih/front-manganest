import instance from "./config.js";

async function CreateChapter(data) {
    try {
        const response = await instance.post("/chapitre", data);
        return response.data;
    } catch (error) {
        console.error("error creating chapter:", error);
        throw error;
    }
}

async function GetChaptersByManga(id) {
    try {
        const response = await instance.get(`/chapitre/manga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapters:", error);
        throw error;
    }
}

async function GetChapterById(id) {
    try {
        const response = await instance.get(`/chapitre/${id}`);
        return response.data;
    } catch (error) {
        console.error("error fetching chapter:", error);
    }
}

async function UpdateChapter(id, data) {
    try {
        const response = await instance.put(`/chapitre/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("error updating chapter:", error);
        throw error;
    }
}

async function DeleteChapter(id) {
    try {
        const response = await instance.delete(`/chapitre/${id}`)
        return response.data;
    } catch (error) {
        console.error("error deleting chapter:", error);
        throw error;
    }
}

export { CreateChapter, GetChapterById, GetChaptersByManga, UpdateChapter, DeleteChapter };