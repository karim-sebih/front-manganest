import instance from "./config.js";

async function GetPendingManga() {
    try {
        const response = await instance.get('/adminmanga/pending');
        return response.data;
    } catch (error) {
        console.error({ message: "Error fetching pending manga" });
        throw error;
    }

}
async function ApproveManga(id) {
    try {
        const response = await instance.put(`/adminmanga/${id}/approve`);
        return response.data;
    } catch (error) {
        console.error("Error approving manga:", error);
        throw error;
    }
}

async function RejectManga(id) {
    try {
        const response = await instance.put(`/adminmanga/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error("Error rejecting manga:", error);
        throw error;
    }
}

async function GetApprovedManga() {
    try {
        const response = await instance.get('/adminmanga/approved');
        return response.data;
    } catch (error) {
        console.error
        throw error
    }
}

async function DeleteManga(id) {
    try {
        const response = await instance.delete(`/adminmanga/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting selfmanga :", error);
        throw error;
    }
}

export { GetPendingManga, ApproveManga, RejectManga, GetApprovedManga, DeleteManga }