import axiosInstance from '@/utils/axios';
import {USER, USER_CREATE, USERS} from '@/utils/endpoints/endpoints';
import {IUser} from '@/utils/interfaces/user.interface';
import {IUserDto} from '@/utils/dto/user.dto';

export const getUsers = async (): Promise<IUser[] | undefined> => {
    try {
        const res = await axiosInstance.post(USERS);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const getUser = async (payload: {id: string}): Promise<IUser | undefined> => {
    try {
        const res = await axiosInstance.get(USER(payload.id));
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const updateUser = async (payload: IUserDto): Promise<any> => {
    try {
        const res = await axiosInstance.put(USERS, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};
export const createUser = async (payload: IUserDto): Promise<IUser | undefined> => {
    try {
        const res = await axiosInstance.post(USER_CREATE, payload);
        return res.data;
    } catch (error: any) {
        console.error(error);
    }
};