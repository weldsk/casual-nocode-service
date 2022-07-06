import React, { useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { Form, Button, Alert } from "react-bootstrap";

interface LoginFormValues {
  email: string,
  password: string,
};

const errorSchema = yup.object().shape({
  email: yup.string()
    .required("Enter your email"),
  password: yup.string()
    .required("Enter your password")
})

const Login: React.VFC = () => {
  const navigate = useNavigate();
  const [formAlertFlag, setFormAlertFlag] = useState(false);
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  }
  const onSubmit = (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {//Post Request
    const postData = {
      email: values.email,
      password: values.password
    }
    axios.post(process.env.REACT_APP_API_URL + "/login", postData
    ).then((response: AxiosResponse) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data))
        navigate("/");
      }
      else {
        alert("An unexpected error has occurred.");
      }
    }).catch((error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        setFormAlertFlag(true);
      }
      else {
        alert("An unexpected error has occurred.");
      }
    })
  }
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
              <h3>Sign In</h3>
              <Alert show={formAlertFlag} variant="light" className="alert mb-0">
                The account does not exist or the password is incorrect.
              </Alert>
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
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  id="remember-checkbox"
                  label="Remember me"
                />
              </Form.Group>
              <Button type="submit">
                Login
              </Button>
              <p className="forgot-password right">
                Forgot <a href="/#">password?</a>
              </p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Login;