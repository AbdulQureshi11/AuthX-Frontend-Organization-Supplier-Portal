import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  addSubUser,
  updateUserStatus,
  deleteSubUser,
  clearMessages,
} from "../../../features/users/usersSlice";
import { FaUserPlus, FaTrash, FaEdit } from "react-icons/fa";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, successMessage } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleAddSubUser = () => {
    dispatch(addSubUser(form)).then(() => {
      setShowModal(false);
      setForm({ name: "", email: "", password: "" });
    });
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    dispatch(updateUserStatus({ id, status: newStatus }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this sub-user?")) {
      dispatch(deleteSubUser(id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Users Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <FaUserPlus /> Add Sub-User
        </button>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      {/* Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4 capitalize">{u.role}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleStatus(u._id, u.status)}
                    className={`px-3 py-1 rounded-lg text-white ${
                      u.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {u.status}
                  </button>
                </td>
                <td className="py-3 px-4 flex gap-3 justify-center">
                  {u.role === "sub" && (
                    <>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Sub-User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Sub-User</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubUser}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
