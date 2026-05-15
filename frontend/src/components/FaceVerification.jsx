import React, { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FaceVerification = ({ storedDescriptor, onVerified }) => {
  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  const verifyFace = async () => {
    const video = webcamRef.current.video;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected");
      return;
    }

    const liveDescriptor = Array.from(detection.descriptor);

    const distance = faceapi.euclideanDistance(
      liveDescriptor,
      storedDescriptor,
    );

    if (distance < 0.45) {
      alert("Face Verified");

      onVerified();
    } else {
      alert("Face does not match");
    }
  };

  return (
    <div>
      <h2>Face Verification</h2>

      <Webcam ref={webcamRef} audio={false} />
      <br></br>
      <Button onClick={verifyFace}>Verify Face</Button>
      <br></br>
      <br></br>
    </div>
  );
};

export default FaceVerification;
