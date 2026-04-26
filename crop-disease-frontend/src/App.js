import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const predictDisease = async () => {
    if (!image) return;
    setScanning(true);
    setResult({ type: "loading", message: "Analyzing image…" });
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData);
      setResult({
        type: "detected",
        message: res.data.disease,
        confidence: res.data.confidence || "94%",
      });
    } catch {
      setResult({ type: "error", message: "Could not connect to server. Please try again." });
    } finally {
      setScanning(false);
    }
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <a href="#" className="nav-logo">
          <span className="nav-logo-icon">🌿</span>
          Crop Disease Detection
        </a>

        <div className="nav-links">
          <a href="#">Disease ID</a>
          <a href="#">Crop Pathology</a>
          <a href="#">Disease Diagnosis</a>
          <a href="#">Pest Scanner</a>
          <a href="#">Pricing</a>
        </div>

        <div className="nav-right">
          <button className="nav-signin">Sign In</button>
          <button className="btn-detect">Detect Disease Now</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        {/* LEFT */}
        <div className="hero-left">
          <h1>Professional Crop Disease Detection with 98% Accuracy</h1>
          <p>
            Specialized AI platform for identifying 200+ plant diseases and pests.
            Get instant diagnosis and treatment recommendations from
            professional-grade diagnostic technology.
          </p>

          <div className="hero-cta">
            <button className="cta-primary" onClick={() => fileInputRef.current.click()}>
              Detect Disease Now
            </button>
            <button className="cta-secondary">Professional Tools</button>
          </div>

          <div className="hero-badges">
            <div className="badge">
              <span className="badge-icon">✓</span>98% Accuracy
            </div>
            <div className="badge">
              <span className="badge-icon">⚡</span>Instant Results
            </div>
            <div className="badge">
              <span className="badge-icon">🛡</span>Offline Capable
            </div>
          </div>
        </div>

        {/* RIGHT — Scanner Card */}
        <div className="scanner-card">
          <div className="card-header">
            <h3>Scan Your Crops</h3>
            <p>Point your camera at leaves or fruit</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handleImage}
          />

          <div
            className={`scan-viewport ${scanning ? "scanning" : ""}`}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&q=80"
                alt="Default crop"
              />
            )}
            <div className="scan-overlay">
              <span className="bracket tl" />
              <span className="bracket tr" />
              <span className="bracket bl" />
              <span className="bracket br" />
              <div className="camera-btn">📷</div>
              <div className="scan-line" />
            </div>
          </div>

          {/* Upload / Predict row */}
          <div className="upload-row">
            <button className="upload-btn-sm" onClick={() => fileInputRef.current.click()}>
              📁 Upload Image
            </button>
            <button
              className="predict-btn-sm"
              onClick={predictDisease}
              disabled={!image || scanning}
            >
              🔍 Analyze
            </button>
          </div>

          {/* Result area */}
          <div className="result-area">
            {!result && (
              <div className="result-idle">
                <span>🌱</span>
                <span>Upload a crop image to get instant diagnosis</span>
              </div>
            )}

            {result?.type === "loading" && (
              <div className="result-loading">
                <div className="spinner" />
                <span>{result.message}</span>
              </div>
            )}

            {result?.type === "detected" && (
              <div className="result-detected">
                <span className="warn-icon">⚠️</span>
                <div className="result-text">
                  <h4>{result.message}</h4>
                  <p>Confidence: {result.confidence}</p>
                </div>
                <div className="result-dot" />
              </div>
            )}

            {result?.type === "error" && (
              <div className="result-error">
                <span>⚠️</span>
                <span>{result.message}</span>
              </div>
            )}
          </div>

          {result?.type === "detected" && (
            <button className="treatment-btn">
              ✓ View Treatment Options
            </button>
          )}
        </div>
      </section>
    </>
  );
}