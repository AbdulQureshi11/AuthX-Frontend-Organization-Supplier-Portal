import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  addSubUser,
  updateUserStatus,
  deleteSubUser,
  clearMessages,
} from "../../../features/users/usersSlice";
import { FaUserPlus, FaTrash, FaEdit } from "react-icons/fa";
import Inputfield from "../../../Common/Inputfield";
import Primarybtn from "../../../Common/Primarybtn";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector(
    (state) => state.user
  );

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(clearMessages());
  }, [dispatch]);

  // ✅ Yup validation schema for the modal form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required*"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required*"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required*"),
  });

  // ✅ Handle add sub-user
  const handleSubmit = async (values, { resetForm }) => {
    await dispatch(addSubUser(values));
    resetForm();
    setShowModal(false);
    dispatch(getUsers());
  };

  // ✅ Toggle user active/inactive
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    dispatch(updateUserStatus({ id, status: newStatus }));
  };

  // ✅ Delete user
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sub-user?")) {
      dispatch(deleteSubUser(id));
    }
  };

  return (
    <div className="space-y-6 font-Robot">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Users Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FaUserPlus /> Add Sub-User
        </button>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && (
        <p className="text-green-600">{successMessage}</p>
      )}

      {/* Users Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4 capitalize">{u.role}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleStatus(u._id, u.status)}
                    className={`px-3 py-1 rounded-lg text-white font-medium transition ${
                      u.status === "active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {u.status}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  {u.role === "sub" && (
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit (Coming Soon)"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Add Sub-User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Add Sub-User
            </h3>

            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, resetForm }) => (
                <Form className="space-y-4">
                  {/* Name */}
                  <div>
                    <Inputfield
                      label="Full Name"
                      type="text"
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#0041cc]"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-xs sm:text-sm text-red-600 mt-1"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Inputfield
                      label="Email Address"
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#0041cc]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-xs sm:text-sm text-red-600 mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Inputfield
                      label="Password"
                      type="password"
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#0041cc]"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs sm:text-sm text-red-600 mt-1"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow-sm transition"
                    >
                      Cancel
                    </button>

                    <Primarybtn
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Primarybtn>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
