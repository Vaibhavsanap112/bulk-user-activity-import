import { useEffect, useState } from "react";

export default function Errors() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const importId = localStorage.getItem("importId");

    if (!importId) {
      setLoading(false);
      return;
    }

    const fetchErrors = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/import/errors/${importId}`
        );

        const data = await res.json();
        setErrors(data);
      } catch (err) {
        console.log("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading errors...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-4 text-center">
        Invalid Records
      </h2>

      {errors.length > 0 ? (
        <div className="overflow-x-auto">

          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">

            {/* Header */}
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Error</th>
                <th className="py-2 px-4 text-left">User ID</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Activity</th>
                <th className="py-2 px-4 text-left">Timestamp</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {errors.map((err, index) => {
                let record = {};

                try {
                  record =
                    typeof err.record_data === "string"
                      ? JSON.parse(err.record_data)
                      : err.record_data;
                } catch (e) {
                  console.log("Parse error:", e);
                }

                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-2 px-4 text-red-500 font-medium">
                      {err.error_message}
                    </td>
                    <td className="py-2 px-4">
                      {record.userId || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {record.email || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {record.activity || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {record.timestamp || "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4">
          No invalid records ❌
        </p>
      )}
    </div>
  );
}