import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Components from "../Components";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Define the CSS style for error messages
const errorStyle = {
  color: "red",
  fontSize: "0.875rem",
};

const Login = ({ onLoginSuccess }) => {
  const [signIn, toggle] = useState(true);
  const navigate = useNavigate();

  // Yup validation schemas
  const signUpValidationSchema = Yup.object({
    fname: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone must be numeric")
      .min(10, "Phone must be at least 10 digits")
      .required("Phone number is required"),
  });

  const signInValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passphrase: Yup.string().required("Passphrase is required"),
  });

  // Formik for Sign Up
  const signUpFormik = useFormik({
    initialValues: {
      email: "",
      fname: "",
      password: "",
      phone: "",
    },
    validationSchema: signUpValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/users/register", values);
        console.log("Sign Up successful:", response.data);

        const originalPassphrase = response.data.passphrase.original_passphrase; // Adjust if nested differently
        toast.success(`Your passphrase: ${originalPassphrase}`);
        toast.success("Please take note or screenshot of your passphrase!");
      } catch (error) {
        console.error("Sign Up error:", error.response ? error.response.data : error.message);
        toast.error("Sign Up failed. Please try again.");
      }
    },
  });

  // Formik for Sign In
  const signInFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passphrase: "",
    },
    validationSchema: signInValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/users/login", values);
        console.log("Sign In successful:", response.data);

        const { role, access } = response.data;
        sessionStorage.setItem("accessToken", access);
        sessionStorage.setItem("role", role);
        toast.success("Sign In successful!");

        onLoginSuccess(); // Call the callback function
        if (role === "admin") {
          navigate("/admin"); // Redirect to the admin dashboard
        } else if (role === "user") {
          navigate("/"); // Redirect regular user to the homepage
        } else {
          toast.error("Unauthorized access");
        }
      } catch (error) {
        console.error("Sign In error:", error.response ? error.response.data : error.message);
        toast.error("Sign In failed. Please try again.");
      }
    },
  });

  return (
    <Components.Container>
      <Components.SignUpContainer $signinIn={signIn}>
        <Components.Form onSubmit={signUpFormik.handleSubmit}>
          <Components.Title>Create Account</Components.Title>
          <Components.Input
            type="text"
            name="fname"
            placeholder="Name"
            value={signUpFormik.values.fname}
            onChange={signUpFormik.handleChange}
            onBlur={signUpFormik.handleBlur}
          />
          {signUpFormik.touched.fname && signUpFormik.errors.fname ? (
            <div style={errorStyle}>{signUpFormik.errors.fname}</div>
          ) : null}

          <Components.Input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpFormik.values.email}
            onChange={signUpFormik.handleChange}
            onBlur={signUpFormik.handleBlur}
          />
          {signUpFormik.touched.email && signUpFormik.errors.email ? (
            <div style={errorStyle}>{signUpFormik.errors.email}</div>
          ) : null}

          <Components.Input
            type="password"
            name="password"
            placeholder="Password"
            value={signUpFormik.values.password}
            onChange={signUpFormik.handleChange}
            onBlur={signUpFormik.handleBlur}
          />
          {signUpFormik.touched.password && signUpFormik.errors.password ? (
            <div style={errorStyle}>{signUpFormik.errors.password}</div>
          ) : null}

          <Components.Input
            type="text"
            name="phone"
            placeholder="Phone"
            value={signUpFormik.values.phone}
            onChange={signUpFormik.handleChange}
            onBlur={signUpFormik.handleBlur}
          />
          {signUpFormik.touched.phone && signUpFormik.errors.phone ? (
            <div style={errorStyle}>{signUpFormik.errors.phone}</div>
          ) : null}

          <Components.Button type="submit">Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer $signinIn={signIn}>
        <Components.Form onSubmit={signInFormik.handleSubmit}>
          <Components.Title>Sign In</Components.Title>
          <Components.Input
            type="email"
            name="email"
            placeholder="Email"
            value={signInFormik.values.email}
            onChange={signInFormik.handleChange}
            onBlur={signInFormik.handleBlur}
          />
          {signInFormik.touched.email && signInFormik.errors.email ? (
            <div style={errorStyle}>{signInFormik.errors.email}</div>
          ) : null}

          <Components.Input
            type="password"
            name="password"
            placeholder="Password"
            value={signInFormik.values.password}
            onChange={signInFormik.handleChange}
            onBlur={signInFormik.handleBlur}
          />
          {signInFormik.touched.password && signInFormik.errors.password ? (
            <div style={errorStyle}>{signInFormik.errors.password}</div>
          ) : null}

          <Components.Input
            type="text"
            name="passphrase"
            placeholder="Passphrase"
            value={signInFormik.values.passphrase}
            onChange={signInFormik.handleChange}
            onBlur={signInFormik.handleBlur}
          />
          {signInFormik.touched.passphrase && signInFormik.errors.passphrase ? (
            <div style={errorStyle}>{signInFormik.errors.passphrase}</div>
          ) : null}

          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
          <Components.Button type="submit">Sign In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer $signinIn={signIn}>
        <Components.Overlay $signinIn={signIn}>
          <Components.LeftOverlayPanel $signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us, please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel $signinIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter your personal details and start your journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
};

export default Login;