import React, { useState, useRef } from "react";

export default function Recorder({ onUpload }) {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const timerInterval = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Fix: Stop timer if user stops sharing from browser
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        stopRecording();
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        chunks.current = [];
        setVideoUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setRecording(true);

      // start timer
      setTimer(0);
      timerInterval.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 180) {
            stopRecording(); // auto stop at 3 minutes
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setRecording(false);
      clearInterval(timerInterval.current);
    }
  };

  const downloadRecording = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "recording.webm";
    a.click();
  };

  const uploadRecording = async () => {
    if (!videoUrl) return;
    const res = await fetch(videoUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("recording", blob, "recording.webm");

    try {
      const uploadRes = await fetch("http://localhost:5000/api/recordings", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        alert("✅ Upload successful");
        onUpload();
      } else {
        alert("❌ Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Upload error");
    }
  };

  return (
    <div className="mb-6">
      <div className="recorder-controls">
        {!recording ? (
          <button
            onClick={startRecording}
            className="recorder-btn start"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="recorder-btn stop"
          >
            Stop Recording
          </button>
        )}

        <span className="timer">
          ⏱ {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)} / 3:00
        </span>
      </div>

      {videoUrl && (
        <div className="space-y-3">
          <video
            src={videoUrl}
            controls
            className="video-preview"
          ></video>
          <div className="flex gap-4">
            <button
              onClick={downloadRecording}
              className="recorder-btn download"
            >
              Download
            </button>
            <button
              onClick={uploadRecording}
              className="recorder-btn upload"
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
