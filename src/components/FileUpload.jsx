import { useRef, useState } from "react";

const API_URL = "https://json-converter-5.onrender.com/api/upload";

export default function FileUpload() {
  const fileInputRef = useRef();

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Open file browser
  const browseFile = () => fileInputRef.current.click();

  // File select
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  // Upload function
  const uploadFile = (file) => {
    if (!file) return;

    setError("");
    setResult(null);
    setProgress(0);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setResult(response); // 🔥 PURE JSON
      } else {
        setError("Upload failed");
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setError("Network error");
    };

    xhr.send(formData);
  };

  // Reset
  const reset = () => {
    setResult(null);
    setProgress(0);
    setError("");
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="header">
        <h1>File to JSON Converter</h1>
        <p>Upload PDF or Image and get JSON data</p>
      </div>

      {/* Upload Area */}
      {!result && (
        <div
          className="upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="upload-icon">📄</div>
          <h3>Drag & Drop your file</h3>
          <span className="hint">PDF, JPG, PNG</span>

          <button onClick={browseFile}>Browse File</button>

          {loading && (
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="error-text">{error}</p>}

      {/* Result */}
      {result && (
        <div className="result-box">
          <div className="result-header">
            <h2>Extracted JSON</h2>
            <button className="secondary-btn" onClick={reset}>
              Upload Another
            </button>
          </div>

          {/* 🔥 FIXED JSON DISPLAY */}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
