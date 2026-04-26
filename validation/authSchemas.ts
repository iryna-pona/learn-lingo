import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Min 8 characters").required("Password is required"),
});

export const registerSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").max(30, "Name is too long"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Min 8 characters").required("Password is required"),
});