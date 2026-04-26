import * as yup from "yup";

export const bookingSchema = yup.object({
  reason: yup.string().required("Required"),
  fullName: yup.string().min(2, "Name must be at least 2 characters").max(30, "Name is too long").required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup.string().required("Phone is required"),
});