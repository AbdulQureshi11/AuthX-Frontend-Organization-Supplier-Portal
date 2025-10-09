import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConfigs,
  createConfig,
  searchConfigs,
  updateConfig,
} from "../../../features/configs/configsSlice";
import Inputfield from "../../../Common/Inputfield";
import Primarybtn from "../../../Common/Primarybtn";

const Configs = () => {
  const dispatch = useDispatch();
  const { configs, loading, error, successMessage } = useSelector(
    (state) => state.config
  );
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  const initialValues = {
    name: "",
    endpoint: "",
    username: "",
    password: "",
    targetBranch: "",
    pcc: "",
    apiType: "sandbox",
    status: "active",
    priority: 1,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required*"),
    endpoint: Yup.string().required("This field is required*"),
    username: Yup.string().required("This field is required*"),
    password: Yup.string().required("This field is required*"),
    targetBranch: Yup.string().required("This field is required*"),
    pcc: Yup.string().required("This field is required*"),
    apiType: Yup.string().required("Select an API Type*"),
    status: Yup.string().required("Select status*"),
    priority: Yup.number()
      .typeError("Must be a number*")
      .required("Priority is required*")
      .min(1, "Minimum value is 1"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (editMode && editId) {
      await dispatch(updateConfig({ id: editId, formData: values }));
      setEditMode(false);
      setEditId(null);
    } else {
      await dispatch(createConfig(values));
    }
    resetForm();
    dispatch(fetchConfigs());
  };

  const handleEdit = (config) => {
    setEditMode(true);
    setEditId(config._id);
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (config) => {
    const newStatus = config.status === "active" ? "inactive" : "active";
    await dispatch(
      updateConfig({ id: config._id, formData: { ...config, status: newStatus } })
    );
    dispatch(fetchConfigs());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(searchConfigs(search));
    } else {
      dispatch(fetchConfigs());
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 rounded-2xl p-8 md:p-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0041cc] font-RobotB">
          API Configuration Management
        </h2>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search configs..."
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0041cc]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#0041cc] text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Notifications */}
      {error && <p className="text-red-600 mb-3 font-medium">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-3 font-medium">{successMessage}</p>
      )}

      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 border border-gray-200 mb-12">
        <h3 className="text-xl md:text-2xl font-bold font-Robot text-[#002C8B] mb-6">
          {editMode ? "Edit Configuration" : "Add New Configuration"}
        </h3>

        <Formik
          enableReinitialize
          initialValues={
            editMode && editId
              ? configs.find((c) => c._id === editId) || initialValues
              : initialValues
          }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form className="space-y-6 font-Robot">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "name", label: "Name", type: "text" },
                  { name: "endpoint", label: "Endpoint", type: "text" },
                  { name: "username", label: "Username", type: "text" },
                  { name: "password", label: "Password", type: "password" },
                  { name: "targetBranch", label: "Target Branch", type: "text" },
                  { name: "pcc", label: "PCC", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <Inputfield
                      label={field.label}
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={values[field.name]}
                      onChange={(e) =>
                        setFieldValue(field.name, e.target.value)
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full transition"
                    />
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-xs sm:text-sm font-medium text-red-600 mt-1"
                    />
                  </div>
                ))}

                {/* API Type */}
                <div>
                  <label className="mb-2 font-semibold text-gray-800 text-sm md:text-base">
                    API Type
                  </label>
                  <select
                    id="apiType"
                    name="apiType"
                    value={values.apiType}
                    onChange={(e) => setFieldValue("apiType", e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full transition"
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                  <ErrorMessage
                    name="apiType"
                    component="div"
                    className="text-xs sm:text-sm font-medium text-red-600 mt-1"
                  />
                </div>

                {/* Priority */}
                <div>
                  <Inputfield
                    label="Priority"
                    type="number"
                    id="priority"
                    name="priority"
                    value={values.priority}
                    onChange={(e) => setFieldValue("priority", e.target.value)}
                    placeholder="Enter priority"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0041cc] shadow-sm w-full transition"
                  />
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-xs sm:text-sm font-medium text-red-600 mt-1"
                  />
                </div>
              </div>

              <div className="text-center mt-4 flex justify-center gap-4">
                <Primarybtn
                  type="submit"
                  className="rounded-lg px-6 py-3 cursor-pointer text-lg text-white bg-gradient-to-r from-[#002C8B] to-[#0041cc] hover:opacity-90 transition-all shadow-md"
                >
                  {loading
                    ? "Processing..."
                    : editMode
                    ? "Update Config"
                    : "Save Configuration"}
                </Primarybtn>

                {editMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setEditId(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-lg rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Config Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm bg-white rounded-xl shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 uppercase text-xs">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Endpoint</th>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">API Type</th>
              <th className="p-3 border text-center">Status</th>
              <th className="p-3 border text-center">Priority</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs?.map((c, i) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="p-3 border text-gray-600">{i + 1}</td>
                <td className="p-3 border font-medium text-gray-800">{c.name}</td>
                <td className="p-3 border text-blue-600 break-all">
                  <a href={c.endpoint} target="_blank" rel="noreferrer">
                    {c.endpoint}
                  </a>
                </td>
                <td className="p-3 border text-gray-700">{c.username}</td>
                <td className="p-3 border capitalize text-gray-700">{c.apiType}</td>
                <td className="p-3 border text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3 border text-center text-gray-700">
                  {c.priority}
                </td>
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`px-3 py-1 text-xs rounded-md text-white transition ${
                        c.status === "active"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {c.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {configs?.length === 0 && (
              <tr>
                <td colSpan="8" className="p-5 text-center text-gray-500">
                  No API configurations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Configs;
