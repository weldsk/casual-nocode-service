import React from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Form, Button } from "react-bootstrap";
import * as yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";

interface SignUpFormValues {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
};

const errorSchema = yup.object().shape({
  username: yup.string()
    .required("Enter a username")
    .max(30, "Your username must be less than 30 characters")
    .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,30}$/,
      "Contains characters that cannot be used. Only alphanumeric characters and '-' are allowed. The '-' cannot be used consecutively, at the beginning, or at the end."),
  email: yup.string()
    .required("Enter a email")
    .email("Email is invalid or already registered"),
  password: yup.string()
    .required("Enter a password")
    .matches(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?!.*?\\)[\x21-\x7e]{8,50}$/,
      "Your password must be between 8 and 50 characters. Must contain one uppercase, one lowercase and one number."
    ),
  confirmPassword: yup.string()
    .required("Confirm your password")
    .oneOf([yup.ref('password'), null], "Passwords do not match"),
});

const SignUp: React.VFC = () => {
  const navigate = useNavigate();
  const initialValues: SignUpFormValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
  const onSubmit = (values: SignUpFormValues, actions: FormikHelpers<SignUpFormValues>) => {//Post Request
    const postData = {
      name: values.username,
      email: values.email,
      password: values.password
    }
    axios.post(process.env.REACT_APP_API_URL + "/signup", postData
    ).then((response: AxiosResponse) => {
      navigate("/login");
      /*TODO*/
    }).catch((error: AxiosError) => {
      if (error.response && error.response.status === 409) {
        actions.setErrors({ email: "Email is invalid or already registered" })
      }
      else {
        /*TODO*/
      }
    })
  };

  return (
    <Formik
      validationSchema={errorSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <div className="auth-wrapper">
            <div className="auth-inner">
              <h3>Sign Up</h3>

              <Form.Group className="mb-3">
                <Form.Label>User name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="username"
                  placeholder="User name"
                  autoComplete="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit">
                Sign Up
              </Button>
              <p className="forgot-password text-right">
                Already registered <a href="/#">sign in?</a>
              </p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
