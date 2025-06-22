import { z } from "zod";

const passwordMixture = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password should be less than 16 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    )

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: passwordMixture
});

export type SignupSchemaType = z.infer<typeof signupSchema>;
