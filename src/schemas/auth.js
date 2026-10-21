import z from "zod";

const EMAIL_SCHEMA = z.string().email("Invalid email address");
const PASSWORD_SCHEMA = z
    .string()
    .min(6, "Password must be at least 6 characters long");

export const REGISTER_FORM_SCHEMA = z.object({
    name: z.string().min(1, "Name is required"),
    email: EMAIL_SCHEMA,
    mobile: z
        .string()
        .min(10, "Mobile number must be at least 10 digits long")
        .max(10, "Mobile number must be at most 10 digits long"),
    password: PASSWORD_SCHEMA,
});

export const LOGIN_FORM_SCHEMA = z.object({
    email: EMAIL_SCHEMA,
    password: PASSWORD_SCHEMA,
});
