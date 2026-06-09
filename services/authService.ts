import api from "./api";

export const register = (data: {
    userName: string;
    email: string;
    password: string;
    telepon?: string;
    alamat?: string;
}) => {
    return api.post(
        "/auth/register",
        data
    );
};

export const login = (data: {
    email: string;
    password: string;
}) => {
    return api.post(
        "/auth/login",
        data
    );
};