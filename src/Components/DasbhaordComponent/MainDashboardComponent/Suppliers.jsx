import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier,
  clearSupplierMessages,
} from "../../../features/suppliers/supplierSlice";
import Inputfield from "../../../Common/Inputfield";
import Primarybtn from "../../../Common/Primarybtn";

const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, loading, error, successMessage } = useSelector(
    (state) => state.supplier
  );

  const [editId, setEditId] = useState(null);

  // Fetch all suppliers on mount
  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(clearSupplierMessages());
  }, [dispatch]);

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Supplier name is required*"),
    endpoint: Yup.string().required("Endpoint is required*"),
    username: Yup.string().required("Username is required*"),
    password: Yup.string().required("Password is required*"),
    targetBranch: Yup.string(),
    pcc: Yup.string(),
    apiType: Yup.string().required("API type is required*"),
  });

  // Default initial values
  const initialValues = {
    name: "",
    endpoint: "",
    username: "",
    password: "",
    targetBranch: "",
    pcc: "",
    apiType: "sandbox",
  };

  // Handle form submit
  const handleSubmit = async (values, { resetForm }) => {
    if (editId) {
      await dispatch(updateSupplier({ id: editId, formData: values }));
      setEditId(null);
    } else {
      await dispatch(createSupplier(values));
    }

    resetForm();
    dispatch(fetchSuppliers());
  };

  // Handle edit click
  const handleEdit = (supplier, setValues) => {
    setEditId(supplier._id);
    setValues({
      name: supplier.name,
      endpoint: supplier.endpoint,
      username: supplier.username,
      password: supplier.password,
      targetBranch: supplier.targetBranch,
      pcc: supplier.pcc,
      apiType: supplier.apiType,
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      dispatch(deleteSupplier(id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-RobotB">
          {editId ? "Edit Supplier" : "Add Supplier"}
        </h2>

        {/* Notification messages */}
        {error && <p className="text-red-500 mb-3 font-medium">{error}</p>}
        {successMessage && (
          <p className="text-green-600 mb-3 font-medium">{successMessage}</p>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setValues, resetForm }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-Robot">
              {/* Supplier Name */}
              <div>
                <Inputfield
                  label="Supplier Name"
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                  placeholder="Enter supplier name"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>

              {/* Endpoint */}
              <div>
                <Inputfield
                  label="API Endpoint"
                  type="text"
                  id="endpoint"
                  name="endpoint"
                  value={values.endpoint}
                  onChange={(e) => setValues({ ...values, endpoint: e.target.value })}
                  placeholder="Enter API endpoint"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full"
                />
                <ErrorMessage
                  name="endpoint"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>

              {/* Username */}
              <div>
                <Inputfield
                  label="Username"
                  type="text"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={(e) => setValues({ ...values, username: e.target.value })}
                  placeholder="Enter username"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full"
                />
                <ErrorMessage
                  name="username"
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
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  placeholder="Enter password"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>

              {/* Target Branch */}
              <div>
                <Inputfield
                  label="Target Branch"
                  type="text"
                  id="targetBranch"
                  name="targetBranch"
                  value={values.targetBranch}
                  onChange={(e) =>
                    setValues({ ...values, targetBranch: e.target.value })
                  }
                  placeholder="Enter target branch"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full"
                />
                <ErrorMessage
                  name="targetBranch"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>

              {/* PCC */}
              <div>
                <Inputfield
                  label="PCC"
                  type="text"
                  id="pcc"
                  name="pcc"
                  value={values.pcc}
                  onChange={(e) => setValues({ ...values, pcc: e.target.value })}
                  placeholder="Enter PCC"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full"
                />
                <ErrorMessage
                  name="pcc"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>

              {/* API Type */}
              <div>
                <label className="text-gray-700 font-medium text-sm">
                  API Type
                </label>
                <Field
                  as="select"
                  name="apiType"
                  value={values.apiType}
                  onChange={(e) => setValues({ ...values, apiType: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full mt-1"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </Field>
                <ErrorMessage
                  name="apiType"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>

              {/* Submit Buttons */}
              <div className="col-span-2 flex gap-4 mt-4">
                <Primarybtn
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
                >
                  {loading
                    ? "Saving..."
                    : editId
                    ? "Update Supplier"
                    : "Add Supplier"}
                </Primarybtn>

                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      resetForm();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg shadow-md"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="col-span-2 border-t mt-6 pt-4" />

              {/* Suppliers Table */}
              <div className="col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Suppliers List
                </h3>

                {loading ? (
                  <p>Loading suppliers...</p>
                ) : suppliers.length === 0 ? (
                  <p className="text-gray-500">No suppliers found.</p>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Endpoint</th>
                        <th className="p-2 border">Username</th>
                        <th className="p-2 border">API Type</th>
                        <th className="p-2 border text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map((s) => (
                        <tr key={s._id} className="hover:bg-gray-50">
                          <td className="p-2 border">{s.name}</td>
                          <td className="p-2 border">{s.endpoint}</td>
                          <td className="p-2 border">{s.username}</td>
                          <td className="p-2 border">{s.apiType}</td>
                          <td className="p-2 border text-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(s, setValues)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(s._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Suppliers;
