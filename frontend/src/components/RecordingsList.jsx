import React, { useEffect, useState } from "react";

export default function RecordingsList({ refresh }) {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetch("https://assignment-amberflux.onrender.com/api/recordings")
      .then((res) => res.json())
      .then((data) => setRecordings(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [refresh]);

  return (
    <div className="recordings-list">
      <h2 className="text-xl font-semibold mb-3">📂 Uploaded Recordings</h2>
      {recordings.length === 0 ? (
        <p>No recordings uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {recordings.map((rec) => (
            <li
              key={rec.id}
              className="recording-card"
            >
              <p>
                <strong>Filename:</strong> {rec.filename}
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {(rec.filesize / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(rec.createdAt).toLocaleString()}
              </p>
              <video
                src={`https://assignment-amberflux.onrender.com/${rec.filepath}`}
                controls
              ></video>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
