import instance from "./config.js";

async function register(user) {
    return await instance.post("/auth/register",user);
}

async function login(user){
    return await instance.post("/auth/login", user);
}

export {register, login};