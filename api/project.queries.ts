import axiosInstance from "@/lib/axios";
import { Project } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      try {
        const response = await axiosInstance.get(`/projects/user`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
  });
};

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async (): Promise<Project> => {
      try {
        const response = await axiosInstance.get(`/project/${projectId}`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
  });
};
export const useCreateProject = () => {
  return useMutation({
    mutationFn: async ({
      name,
      description,
      userIds,
      slug,
    }: {
      name: string;
      description?: string;
      userIds: string[];
      slug?: string;
    }) => {
      try {
        const response = await axiosInstance.post("/project", {
          name,
          description,
          userIds,
          slug,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
