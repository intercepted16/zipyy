import { z } from "zod";
export const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string()?.min(1, "Please enter a password."),
});
