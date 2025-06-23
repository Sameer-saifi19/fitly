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


export const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: passwordMixture
});

export type SigninSchemaType = z.infer<typeof signinSchema>;
