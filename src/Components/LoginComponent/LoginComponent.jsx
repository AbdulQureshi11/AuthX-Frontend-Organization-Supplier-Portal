// src/components/Auth/LoginComponent.jsx
import React, { useEffect } from "react";
import Inputfield from "../../Common/Inputfield";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import Primarybtn from "../../Common/Primarybtn";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This Field is Required"),
    password: Yup.string().required("This Field is Required"),
  });

  // 🔹 Redirect on successful login
  useEffect(() => {
    if (user && token) {
      if (user.role === "main") {
        navigate("/admin-dashboard");
      } else {
        navigate("/sub-dashboard");
      }
    }
  }, [user, token, navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Login Here
        </h1>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <Inputfield
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  value={values?.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  className="text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="font-semibold text-red-400 text-sm mt-1"
                />
              </div>

              <div>
                <Inputfield
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  value={values?.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  className="text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="font-semibold text-red-400 text-sm mt-1"
                />
              </div>

              <Primarybtn
                type="submit"
                disabled={loading}
                className="w-full text-lg font-semibold bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition-all duration-200"
              >
                {loading ? "Logging in..." : "Login"}
              </Primarybtn>

              {error && (
                <p className="text-red-400 text-center font-semibold mt-3">
                  {error}
                </p>
              )}
            </Form>
          )}
        </Formik>

        <div className="text-center mt-6">
          <p className="text-gray-300 hover:text-white transition-all duration-200">
            Don’t have an account?{" "}
            <span className="text-green-400 font-semibold">
              <Link to="/register">Register</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
