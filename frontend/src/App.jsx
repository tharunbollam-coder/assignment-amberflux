import React, { useState } from "react";
import Recorder from "./components/Recorder";
import RecordingsList from "./components/RecordingsList";
import "./App.css";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="app-container">
      <h1>🎥 Screen Recorder App</h1>

      <Recorder onUpload={() => setRefresh(!refresh)} />

      <hr />

      <RecordingsList refresh={refresh} />
    </div>
  );
}
