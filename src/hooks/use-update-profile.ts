import { updateProfileAction } from "@/actions/auth";
import { profileSchema, ProfileSchema } from "@/validation/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "./use-auth";

export const useUpdateProfile = () => {
  const { session, refetch } = useAuth();
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (session) {
      form.reset({
        name: session.user.name,
        email: session.user.email ?? "",
        phone: session.user.phone ?? "",
      });
    }
  }, [session, form]);

  const {
    mutate: updateProfile,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: ProfileSchema) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.password) {
        formData.append("password", data.password);
        formData.append(
          "password_confirmation",
          data.password_confirmation as string
        );
      }
      if (data.image) {
        formData.append("image", data.image[0]);
      }
      return updateProfileAction(session?.token as string, formData);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const onSubmit = (data: ProfileSchema) => {
    updateProfile(data);
  };

  return { form, onSubmit, isPending, isError, error };
};
