import React, { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";

import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FaceRegistration = ({ onFaceCaptured }) => {
  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [instruction, setInstruction] = useState("Loading face models...");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      setModelsLoaded(true);

      setInstruction("Please position your face");
    };

    loadModels();
  }, []);

  const captureFace = async () => {
    if (!modelsLoaded) {
      alert("Models not loaded yet");
      return;
    }

    const video = webcamRef.current.video;

    if (!video) {
      alert("Webcam not ready");
      return;
    }

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected");
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    onFaceCaptured(descriptor);

    setInstruction("Face captured successfully");
  };

  return (
    <div>
      <h2>Face Registration</h2>

      <p>{instruction}</p>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
      />
      <br></br>
      <Button onClick={captureFace}>Capture Face</Button>
    </div>
  );
};

export default FaceRegistration;
