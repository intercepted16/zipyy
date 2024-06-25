import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email address.").required(),
  password: yup.string().min(1, "Please enter a password.").required()
});

export const shortenSchema = yup.object({
  url: yup
    .string()
    .matches(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/, "Please enter a valid URL.")
    .required()
});

const userSchema = yup.object({
  email: yup.string().email("Please enter a valid email address.").notRequired()
});

export const passwordSchema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters.").notRequired(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "The passwords do not match.")
    .notRequired()
});

export const accountFormSchema = passwordSchema.concat(userSchema);
