import { z } from "zod";

export const profileSchema = z
  .object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(11, { message: "Invalid phone number" }),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    image: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.password_confirmation) {
        return false;
      }
      return true;
    },
    {
      message: "Password confirmation is required",
      path: ["password_confirmation"],
    }
  )
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type ProfileSchema = z.infer<typeof profileSchema>;
