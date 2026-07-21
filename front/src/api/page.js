import instance from "./config";

async function CreatePages(chapter_id, formData) {
    try {
        const response = await instance.post(
            `/pages/chapter/${chapter_id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("error creating page:", error);
        throw error;
    }
}




async function GetPagesByChapter(chapter_id) {
    try {
        const response = await instance.get(`/pages/chapter/${chapter_id}`);
        return response.data;
    } catch (error) {
        console.error("error fetching pages by id:", error);
        throw (error);
    }
}

async function UpdatePage(data, id) {
    try {
        const response = await instance.put(`/pages/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("error updating page:", error);
        throw (error);
    }
}

async function DeletePage(id) {
    try {
        const response = await instance.delete(`/pages/${id}`);
        return response.data;
    } catch (error) {
        console.error("error deleting page:", error);
        throw (error);
    }
}

export { CreatePages, GetPagesByChapter, UpdatePage, DeletePage }