import { apiClient } from '../client/axios-client';
import { IPaginatedResponse } from '../client/types';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUserRequest {
  name?: string;
  role?: string;
  status?: string;
}

export const usersApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<IPaginatedResponse<IUser>> => {
    const response = await apiClient.get<IPaginatedResponse<IUser>>('/users', {
      params,
    });
    return response.data;
  },

  getUserById: async (id: string): Promise<IUser> => {
    const response = await apiClient.get<IUser>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: IUpdateUserRequest): Promise<IUser> => {
    const response = await apiClient.put<IUser>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  getProfile: async (): Promise<IUser> => {
    const response = await apiClient.get<IUser>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<IUser>): Promise<IUser> => {
    const response = await apiClient.put<IUser>('/users/profile', data);
    return response.data;
  },
};
