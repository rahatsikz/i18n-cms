"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { useGetAllUsers } from "@/api/auth.queries";
import { getUserAcronyms } from "@/lib/acronym";
import { Textarea } from "./ui/textarea";
import { useCreateProject } from "@/api/project.queries";
import { useQueryClient } from "@tanstack/react-query";

const ProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  users: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        value: z.string(),
        label: z.string(),
        acronym: z.string().optional(),
      })
    )
    .nonempty("At least one user must be selected"),
  description: z.string().optional(),
});

type ProjectValues = z.infer<typeof ProjectSchema>;

export function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const { data, isSuccess } = useGetAllUsers();

  const { mutate } = useCreateProject();

  const form = useForm<ProjectValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      users: [],
      description: "",
    },
  });

  const userOptions = data ? getUserAcronyms(data) : [];
  const queryClient = useQueryClient();

  const onSubmit = async (values: ProjectValues) => {
    try {
      const userIds = values.users.map((user) => user.id.toString());
      mutate(
        { name: values.name, userIds, description: values.description },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["projects"],
            });
            toast.success("Project created successfully");
            setTimeout(() => setOpen(false), 500);
            form.reset();
          },
          onError: (error) => {
            toast.error(error.message || "Failed to create project");
          },
        }
      );
      console.log("Form submitted with values:", values);
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project and assign users to it.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Project Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter project name'
                      autoComplete='off'
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      placeholder='Enter project description'
                      autoComplete='off'
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MultiSelect for Users */}
            {isSuccess && (
              <FormField
                control={form.control}
                name='users'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Users</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={userOptions}
                        placeholder='Select users...'
                        value={field.value}
                        onChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
