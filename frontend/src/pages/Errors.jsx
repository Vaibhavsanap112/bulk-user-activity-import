import { useEffect, useState } from "react";

export default function Errors() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const importId = localStorage.getItem("importId");
    console.log("ImportId:", importId);

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
        console.log("Fetched errors:", data);

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
    return <h2 style={{ padding: "20px" }}>Loading errors...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Invalid Records</h2>

      {errors.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Error Message</th>
              <th>User ID</th>
              <th>Email</th>
              <th>Activity</th>
              <th>Timestamp</th>
            </tr>
          </thead>

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
                <tr key={index}>
                  <td style={{ color: "red" }}>{err.error_message}</td>
                  <td>{record.userId || "N/A"}</td>
                  <td>{record.email || "N/A"}</td>
                  <td>{record.activity || "N/A"}</td>
                  <td>{record.timestamp || "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No invalid records ❌</p>
      )}
    </div>
  );
}