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
} from "@fortawesome/free-solid-svg-icons";
import "./App.css"; // Custom CSS for animations and dark theme

function App() {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [operation, setOperation] = useState("grayscale"); // State to store the selected operation
  const [processedImage, setProcessedImage] = useState(null); // State to store the processed image URL
  const [error, setError] = useState(null); // State to store error messages
  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Clear any previous errors
  };

  // Handle operation selection change
  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    setError(null); // Clear any previous errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    setIsLoading(true); // Show loading spinner
    setError(null); // Clear any previous errors
    setProcessedImage(null); // Clear any previous processed image

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the image and selected operation to the backend
      const response = await axios.post(
        `http://127.0.0.1:8000/process-image/?operation=${operation}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob", // Expect a binary response (image)
        }
      );

      // Create a URL for the processed image and update the state
      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="dark-theme">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <FontAwesomeIcon icon={faMagic} className="me-2" />
            ImageMagic
          </span>
        </div>
      </nav>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Upload and Process Card */}
            <div className="card shadow-lg custom-card">
              <div className="card-header bg-gradient-primary text-white">
                <h5 className="card-title mb-0">
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  Upload and Process Image
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* File Upload Input */}
                  <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">
                      Upload an Image
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      className="form-control custom-file-input"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                  </div>

                  {/* Operation Selection Dropdown */}
                  <div className="mb-3">
                    <label htmlFor="operationSelect" className="form-label">
                      Select Operation
                    </label>
                    <select
                      id="operationSelect"
                      className="form-select custom-select"
                      value={operation}
                      onChange={handleOperationChange}
                    >
                      <option value="grayscale">Grayscale</option>
                      <option value="histogram_equalization">
                        Histogram Equalization
                      </option>
                      <option value="contrast_stretching">
                        Contrast Stretching
                      </option>
                      <option value="quantization">Quantization</option>
                      <option value="canny_edge_detection">
                        Canny Edge Detection
                      </option>
                      <option value="sobel_edge_detection">
                        Sobel Edge Detection
                      </option>
                      <option value="gaussian_blur">Gaussian Blur</option>
                      <option value="median_blur">Median Blur</option>
                      <option value="bilateral_filter">Bilateral Filter</option>
                      <option value="binary_threshold">Binary Threshold</option>
                      <option value="adaptive_threshold">
                        Adaptive Threshold
                      </option>
                      <option value="otsu_threshold">Otsu Threshold</option>
                      <option value="erosion">Erosion</option>
                      <option value="dilation">Dilation</option>
                      <option value="opening">Opening</option>
                      <option value="closing">Closing</option>
                      <option value="rotate_90">Rotate 90°</option>
                      <option value="rotate_180">Rotate 180°</option>
                      <option value="flip_horizontal">Flip Horizontal</option>
                      <option value="flip_vertical">Flip Vertical</option>
                      <option value="resize">Resize</option>
                      <option value="hsv_conversion">HSV Conversion</option>
                      <option value="lab_conversion">LAB Conversion</option>
                      <option value="contour_detection">Contour Detection</option>
                      <option value="image_sharpening">Image Sharpening</option>
                      <option value="noise_reduction_gaussian">
                        Noise Reduction (Gaussian)
                      </option>
                      <option value="noise_reduction_median">
                        Noise Reduction (Median)
                      </option>
                    </select>
                  </div>

                  {/* Process Image Button */}
                  <button
                    type="submit"
                    className="btn btn-gradient-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCogs} className="me-2" />
                        Process Image
                      </>
                    )}
                  </button>
                </form>

                {/* Display Error Messages */}
                {error && (
                  <div className="alert alert-danger mt-4" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Processed Image Card */}
            {processedImage && (
              <div className="card shadow-lg mt-4 custom-card">
                <div className="card-header bg-gradient-success text-white">
                  <h5 className="card-title mb-0">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Processed Image
                  </h5>
                </div>
                <div className="card-body text-center">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="img-fluid rounded shadow processed-image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-4 py-3">
        <p className="text-muted">
          &copy; 2023 ImageMagic. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;