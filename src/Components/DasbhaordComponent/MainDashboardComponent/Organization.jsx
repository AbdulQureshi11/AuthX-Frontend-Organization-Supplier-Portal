import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrg,
  updateOrg,
  updateOrgStatus,
  deleteOrg,
  clearOrgMessages,
} from "../../../features/org/orgSlice";
import Inputfield from "../../../Common/Inputfield";
import Primarybtn from "../../../Common/Primarybtn";

const Organization = () => {
  const dispatch = useDispatch();
  const { org, loading, error, successMessage } = useSelector(
    (state) => state.org
  );

  const [editMode, setEditMode] = useState(false);

  
  useEffect(() => {
    const orgId = localStorage.getItem("orgId");
    if (orgId) dispatch(fetchOrg(orgId));
    dispatch(clearOrgMessages());
  }, [dispatch]);

  
  const initialValues = {
    name: org?.name || "",
    address: org?.address || "",
    active: org?.active ?? true,
    maintenanceMode: org?.maintenanceMode ?? false,
  };

  // Yup validation
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Organization name is required*"),
    address: Yup.string().required("Address is required*"),
  });

  // Submit handler (Save Changes)
  const handleSubmit = async (values, { resetForm }) => {
    if (!org?._id) return;
    await dispatch(updateOrg({ id: org._id, formData: values }));
    setEditMode(false);
    dispatch(fetchOrg(org._id));
    resetForm();
  };

  // Active/Inactive toggle
  const handleStatusToggle = async (values) => {
    if (!org?._id) return;
    await dispatch(
      updateOrgStatus({
        id: org._id,
        active: !values.active,
        maintenanceMode: values.maintenanceMode,
      })
    );
    dispatch(fetchOrg(org._id));
  };

  // Maintenance Mode toggle
  const handleMaintenanceToggle = async (values) => {
    if (!org?._id) return;
    await dispatch(
      updateOrgStatus({
        id: org._id,
        active: values.active,
        maintenanceMode: !values.maintenanceMode,
      })
    );
    dispatch(fetchOrg(org._id));
  };

  // Delete org
  const handleDelete = () => {
    if (!org?._id) return;
    if (window.confirm("Are you sure you want to delete this organization?")) {
      dispatch(deleteOrg(org._id));
    }
  };

  if (loading)
    return (
      <p className="text-blue-500 text-center mt-10">
        Loading organization...
      </p>
    );

  if (!org)
    return (
      <p className="text-gray-500 text-center mt-10">
        No organization data found.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        {/* Header Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-RobotB">
              {org?.name || "—"}
            </h2>
            <p className="text-gray-500 mt-1">
              {org?.address || "No address provided"}
            </p>
          </div>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              Edit
            </button>
          )}
        </div>

        {/* Notifications */}
        {error && <p className="text-red-500 mb-3 font-medium">{error}</p>}
        {successMessage && (
          <p className="text-green-600 mb-3 font-medium">{successMessage}</p>
        )}

        {/* Formik Section */}
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form className="space-y-6 font-Robot">
              {editMode && (
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg space-y-5">
                  <div>
                    <Inputfield
                      label="Organization Name"
                      type="text"
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={(e) =>
                        setFieldValue("name", e.target.value)
                      }
                      placeholder="Enter organization name"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full transition"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-xs sm:text-sm font-medium text-red-600 mt-1"
                    />
                  </div>

                  <div>
                    <Inputfield
                      label="Address"
                      type="text"
                      id="address"
                      name="address"
                      value={values.address}
                      onChange={(e) =>
                        setFieldValue("address", e.target.value)
                      }
                      placeholder="Enter address"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full transition"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-xs sm:text-sm font-medium text-red-600 mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Status Section */}
              <div className="flex items-center justify-between mt-6 border-t pt-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      values.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {values.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleStatusToggle(values)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                    values.active
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {values.active ? "Deactivate" : "Activate"}
                </button>
              </div>

              {/* Maintenance Mode Section */}
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    Maintenance Mode
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      values.maintenanceMode
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {values.maintenanceMode ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleMaintenanceToggle(values)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                    values.maintenanceMode
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {values.maintenanceMode ? "Disable" : "Enable"}
                </button>
              </div>

              {/* Footer Buttons */}
              {editMode && (
                <div className="flex justify-end gap-4 mt-8 border-t pt-4">
                  <Primarybtn
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Primarybtn>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      resetForm();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md"
                  >
                    Delete
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Organization;
