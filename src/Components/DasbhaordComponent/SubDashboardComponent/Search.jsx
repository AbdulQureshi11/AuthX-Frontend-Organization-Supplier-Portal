import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { performSearch, clearSearch } from "../../../features/search/searchSlice";

const Search = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { loading, error, results, counts } = useSelector(
    (state) => state.search
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) dispatch(performSearch(query));
    else dispatch(clearSearch());
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <i className="ri-search-2-line text-blue-500 text-2xl"></i>
          Search
        </h2>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search suppliers or API configs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <p className="text-red-500 mb-4 text-sm flex items-center gap-1">
            <i className="ri-error-warning-line"></i>
            {error}
          </p>
        )}

        {/* Results */}
        {!loading && !error && results && (
          <div className="space-y-8">
            {/* Suppliers */}
            {results.suppliers?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Suppliers ({counts.suppliers})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.suppliers.map((s) => (
                    <div
                      key={s._id}
                      className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.endpoint}</p>
                      <p className="text-xs text-gray-400">
                        Username: {s.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        API Type: {s.apiType}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Configs */}
            {results.apiConfigs?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  API Configurations ({counts.apiConfigs})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.apiConfigs.map((a) => (
                    <div
                      key={a._id}
                      className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <p className="font-medium text-gray-800">{a.name}</p>
                      <p className="text-sm text-gray-500">Type: {a.apiType}</p>
                      <p className="text-xs text-gray-400">Status: {a.status}</p>
                      <p className="text-xs text-gray-400">PCC: {a.pcc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.suppliers?.length === 0 &&
              results.apiConfigs?.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                  <i className="ri-file-warning-line text-3xl text-gray-400"></i>
                  <p>No results found for this search query.</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
