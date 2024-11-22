import axiosInstance from '@/utils/axios';
import {LOGIN, SIGNUP} from '@/utils/endpoints/endpoints';

interface ILoginDto {
    email: string;
    password: string;
}

interface ISignupDto {
    username: string;
    email: string;
    password: string;
}

export const login = async (credentials: ILoginDto | undefined) => {
    try {
        const response = await axiosInstance.post(LOGIN, credentials);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const signup = async (payload: ISignupDto | undefined) => {
    try {
        const response = await axiosInstance.post(SIGNUP, payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};