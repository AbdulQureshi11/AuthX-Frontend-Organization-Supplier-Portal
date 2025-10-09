import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  clearSupplierMessages,
} from "../../../features/suppliers/supplierSlice";

const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, loading, error } = useSelector((state) => state.supplier);

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(clearSupplierMessages());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Suppliers</h2>
          </div>
          <div className="text-sm text-gray-400">
            {suppliers?.length || 0} total suppliers
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="p-6 text-blue-500 text-center font-medium">
            Loading suppliers...
          </div>
        )}
        {error && (
          <div className="p-6 text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && suppliers?.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No suppliers found for your organization.
          </div>
        )}

        {/* Supplier Table */}
        {!loading && suppliers?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-t border-gray-100">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Endpoint</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Target Branch</th>
                  <th className="p-3 text-left">PCC</th>
                  <th className="p-3 text-left">API Type</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Priority</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {suppliers.map((s, index) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-900">{s.name}</td>
                    <td className="p-3 text-blue-600 break-all">
                      <a
                        href={s.endpoint}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {s.endpoint}
                      </a>
                    </td>
                    <td className="p-3 text-gray-700">{s.username}</td>
                    <td className="p-3 text-gray-700">
                      {s.targetBranch || "—"}
                    </td>
                    <td className="p-3 text-gray-700">{s.pcc || "—"}</td>
                    <td className="p-3 text-gray-700 capitalize">
                      {s.apiType}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          s.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {s.priority ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && suppliers?.length > 0 && (
          <div className="border-t bg-gray-50 text-sm text-gray-500 px-6 py-3 text-right">
            Last updated:{" "}
            <span className="font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
