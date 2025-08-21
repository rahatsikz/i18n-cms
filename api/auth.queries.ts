import axiosInstance from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        const response = await axiosInstance.post("/auth/create-user", {
          username,
          password,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

// login
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        const response = await axiosInstance.post("/auth/login", {
          username,
          password,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/auth/users`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
  });
};
