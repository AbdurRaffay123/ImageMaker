import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faCogs,
  faSpinner,
  faCheckCircle,
  faUpload,
  faMagic,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [operation, setOperation] = useState("grayscale");
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/process-image/?operation=${operation}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark-theme">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <FontAwesomeIcon icon={faMagic} className="me-2" /> ImageMagic
          </span>
        </div>
      </nav>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg custom-card">
              <div className="card-header bg-gradient-primary text-white">
                <h5 className="card-title mb-0">
                  <FontAwesomeIcon icon={faUpload} className="me-2" /> Upload and Process Image
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">Upload an Image</label>
                    <input
                      id="fileInput"
                      type="file"
                      className="form-control custom-file-input"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="operationSelect" className="form-label">Select Operation</label>
                    <select
                      id="operationSelect"
                      className="form-select custom-select"
                      value={operation}
                      onChange={handleOperationChange}
                    >
                      {["grayscale", "histogram_equalization", "contrast_stretching", "quantization", "canny_edge_detection", "sobel_edge_detection", "gaussian_blur", "median_blur", "bilateral_filter", "binary_threshold", "adaptive_threshold", "otsu_threshold", "erosion", "dilation", "opening", "closing", "rotate_90", "rotate_180", "flip_horizontal", "flip_vertical", "resize", "hsv_conversion", "lab_conversion", "contour_detection", "image_sharpening", "noise_reduction_gaussian", "noise_reduction_median"].map((op) => (
                        <option key={op} value={op}>{op.replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-gradient-primary w-100" disabled={isLoading}>
                    {isLoading ? (
                      <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Processing...</>
                    ) : (
                      <><FontAwesomeIcon icon={faCogs} className="me-2" />Process Image</>
                    )}
                  </button>
                </form>

                {error && <div className="alert alert-danger mt-4" role="alert">{error}</div>}
              </div>
            </div>

            {processedImage && (
              <div className="card shadow-lg mt-4 custom-card">
                <div className="card-header bg-gradient-success text-white">
                  <h5 className="card-title mb-0">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> Processed Image
                  </h5>
                </div>
                <div className="card-body text-center">
                  <img src={processedImage} alt="Processed" className="img-fluid rounded shadow processed-image" />
                </div>
                <div className="download_button">
                    <a href={processedImage} download className="btn btn-success mt-3">
                      <FontAwesomeIcon icon={faDownload} className="me-2" />Download Image
                    </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center mt-4 py-3">
        <p className="text-muted">&copy; {new Date().getFullYear()} ImageMagic. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
