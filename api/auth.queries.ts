import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

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
