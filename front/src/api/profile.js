import instance from "./config";

async function getProfile() {
    return await instance.get("/profile/me");
}

async function updateProfile(updatedUser) {
    return await instance.put("/profile/me", updatedUser);
}

async function getSettings() {
    return await instance.get("/profile/settings");
}


export {
    getProfile,
    updateProfile,
    getSettings
};
