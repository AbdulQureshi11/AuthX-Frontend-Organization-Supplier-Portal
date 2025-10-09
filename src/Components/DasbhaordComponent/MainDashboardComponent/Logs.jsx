import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs, clearLogs } from "../../../features/logs/logsSlice";

const Logs = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.logs);

  useEffect(() => {
    dispatch(fetchLogs());
    return () => dispatch(clearLogs());
  }, [dispatch]);

  // Date Format
  const formatDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Smart User Extractor
  const getUserName = (log) => {
    return (
      log.userId?.name ||
      log.details?.userName ||
      log.details?.request?.body?.name ||
      log.details?.request?.body?.email ||
      log.details?.response?.user?.name ||
      log.details?.response?.user?.email ||
      "—"
    );
  };

  const getUserEmail = (log) => {
    return (
      log.userId?.email ||
      log.details?.response?.user?.email ||
      log.details?.request?.body?.email ||
      ""
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
          <i className="ri-file-list-3-line text-blue-500 text-2xl"></i>
          Activity Logs
        </h2>

        {/* Loading / Error */}
        {loading && <p className="text-blue-500">Fetching logs...</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <i className="ri-file-warning-line text-3xl text-gray-400"></i>
            <p className="mt-2">No logs found for your organization.</p>
          </div>
        )}

        {/* Table */}
        {!loading && logs.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase text-xs">
                  <th className="p-3 border w-12 text-center">#</th>
                  <th className="p-3 border">User</th>
                  <th className="p-3 border">Action</th>
                  <th className="p-3 border">Entity</th>
                  <th className="p-3 border text-center">Status</th>
                  <th className="p-3 border">Message</th>
                  <th className="p-3 border text-center">Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    {/* Index */}
                    <td className="p-3 border text-center text-gray-600">
                      {index + 1}
                    </td>

                    {/* User */}
                    <td className="p-3 border text-gray-800 font-medium">
                      {getUserName(log)}
                      {getUserEmail(log) && (
                        <div className="text-xs text-gray-500">
                          {getUserEmail(log)}
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3 border text-blue-600 font-semibold">
                      {log.action || ""}
                    </td>

                    {/* Entity */}
                    <td className="p-3 border text-gray-700 capitalize">
                      {log.entity || ""}
                    </td>

                    {/* Status */}
                    <td className="p-3 border text-center">
                      {log.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            log.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.status === "success" ? "Success" : "Failed"}
                        </span>
                      )}
                    </td>

                    {/* Message */}
                    <td className="p-3 border text-gray-600 max-w-xs break-words">
                      {log.message?.trim() || ""}
                    </td>

                    {/* Time */}
                    <td className="p-3 border text-center text-gray-500 text-xs">
                      {formatDateTime(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;