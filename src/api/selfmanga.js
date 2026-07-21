import instance from "./config.js";

async function GetUsersSelfManga() {
    try {
        const response = await instance.get("/selfmanga");
        return response.data;
    } catch (error) {
        console.error("Error fetching selfmanga:", error);
        throw error;
    }

}

async function GetAllSelfManga() {
    try {
        const res = await instance.get("/selfmanga/public");
        return res.data;
    } catch (error) {
        console.error("Error fetching selfmanga:", error);
        throw error;
    }
}

async function getSelfMangaById(id) {
    try {
        const response = await instance.get(`/selfmanga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching selfmanga by id:", error);
        throw error;
    }

}

async function createSelfManga(data) {
    try {
        const response = await instance.post("/selfmanga", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating selfmanga :", error);
        throw error;
    }
}

async function updateSelfManga(id, data) {
    try {
        const response = await instance.put(`/selfmanga/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating selfmanga :", error);
        throw error;
    }
}

async function deleteSelfManga(id) {
    try {
        const response = await instance.delete(`/selfmanga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting selfmanga :", error);
        throw error;
    }
}

async function submitManga(id) {
    try {
        const response = await instance.put(`/selfmanga/${id}/submit`);
        return response.data;
    } catch (error) {
        console.error("Error submitting manga:", error);
        throw error;
    }
}

export { GetUsersSelfManga, getSelfMangaById, createSelfManga, updateSelfManga, deleteSelfManga, submitManga, GetAllSelfManga }