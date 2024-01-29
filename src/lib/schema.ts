import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string()?.min(1, "Please enter a password."),
});

export const shortenSchema = z.object({
  url: z
    .string()
    .regex(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
      "Please enter a valid URL."
    ),
});
