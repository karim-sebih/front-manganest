import instance from "./config";

async function getAllUsers() {
    try {
        const response = await instance.get('/adminuser');
        return response.data;
    } catch (error) {
        console.error({ message: "Error fetching all user" })
        throw error
    }


}

async function createUserByAdmin(data) {
    try {
        const response = await instance.post("/adminuser", data);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

async function updateUserByAdmin(id, data) {
    try {
        const response = await instance.put(`/adminuser/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

async function deleteUserByAdmin(id) {
    try {
        const response = await instance.delete(`/adminuser/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export {
    getAllUsers,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin
};