import instance from "./config";

async function DeleteUser(id) {
    try {
        const response = await instance.delete(`/me/${id}`);
        return response.data;

    } catch (error) {
        console.error({ message: "Error deleting user" })
    }
}

export { DeleteUser };