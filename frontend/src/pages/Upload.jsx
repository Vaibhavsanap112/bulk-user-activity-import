import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    try {
      if (!file) {
        setError("Please select a file ❌");
        return;
      }

      setError("");

      const text = await file.text();
      const jsonData = JSON.parse(text);

      // 🔹 Start import
      const startRes = await fetch("http://localhost:3000/api/import/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalRecords: jsonData.length }),
      });

      const startData = await startRes.json();
      const importId = startData.importId;

      localStorage.setItem("importId", importId);

      setStatus("Import started...");

      const chunkSize = 500;
      let processed = 0;

      for (let i = 0; i < jsonData.length; i += chunkSize) {
        const chunk = jsonData.slice(i, i + chunkSize);

        await fetch("http://localhost:3000/api/activity/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            importId,
            data: chunk,
          }),
        });

        processed += chunk.length;

        const percent = Math.floor(
          (processed / jsonData.length) * 100
        );

        setProgress(percent);
        setStatus(`Processed ${processed}/${jsonData.length}`);
      }

      setStatus("Upload Complete ✅");

    } catch (err) {
      setError("Upload failed. Check file format ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow-lg w-96">

        <h2 className="text-xl font-bold text-center mb-4">
          Upload JSON File
        </h2>

       
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

       
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4 border p-2 rounded"
        />

       
        <button
          onClick={handleUpload}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Upload
        </button>

       
        {status && (
          <p className="text-sm text-gray-700 mt-4 text-center">
            {status}
          </p>
        )}

       
        <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        
        <p className="text-center text-sm mt-2">
          {progress}%
        </p>

      </div>
    </div>
  );
}