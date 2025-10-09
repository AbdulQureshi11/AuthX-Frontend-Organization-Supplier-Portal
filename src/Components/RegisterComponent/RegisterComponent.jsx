import React from "react";
import Inputfield from "../../Common/Inputfield";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import Primarybtn from "../../Common/Primarybtn";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    orgName: "",
    address: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(registerUser(values)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Registration successful! Please login to continue.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        resetForm();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("This field is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 chars")
      .required("This field is required"),
    orgName: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
  });

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <ToastContainer />

      <div className="w-full max-w-[500px] p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Create Account
        </h1>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Inputfield
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    id="name"
                    value={values?.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    className="text-white placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="font-semibold text-red-400 text-sm mt-1"
                  />
                </div>

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
              </div>

              {/* Password */}
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

              {/* Org Name */}
              <div>
                <Inputfield
                  label="Organization Name"
                  name="orgName"
                  type="text"
                  placeholder="Enter your organization name"
                  id="orgName"
                  value={values?.orgName}
                  onChange={(e) => setFieldValue("orgName", e.target.value)}
                  className="text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="orgName"
                  component="div"
                  className="font-semibold text-red-400 text-sm mt-1"
                />
              </div>

              {/* Address */}
              <div>
                <Inputfield
                  label="Organization Address"
                  name="address"
                  type="text"
                  placeholder="Enter organization address"
                  id="address"
                  value={values?.address}
                  onChange={(e) => setFieldValue("address", e.target.value)}
                  className="text-white placeholder-gray-400"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="font-semibold text-red-400 text-sm mt-1"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-500 text-center text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Primarybtn
                type="submit"
                disabled={loading}
                className="w-full text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </Primarybtn>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-300 hover:text-white transition-all duration-200">
            Already have an account?{" "}
            <span className="text-green-400 font-semibold">
              <Link to="/">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
