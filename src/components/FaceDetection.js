import React, { useRef, useEffect, useState } from "react";
import "../styles/FaceDetection.css";
import * as faceapi from "face-api.js";

const FaceDetection = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const expressionRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [resultExpression, setResultExpression] = useState("");

  const useTiny = true;
  let initialized = false;
  const minConfidence = 0.7;

  let objExpressionDescriptors = {};

  useEffect(() => {
    const loadModels = async () => {
      const url = process.env.PUBLIC_URL + "/models";
      await faceapi.loadTinyFaceDetectorModel(url);
      await faceapi.loadFaceLandmarkTinyModel(url);
      await faceapi.loadFaceExpressionModel(url);
      await faceapi.loadFaceRecognitionModel(url);
      console.log("Models loaded");
      setIsLoading(false);
    };
    loadModels();

    getVideo();
  }, []);

  const dimensions = {
    width: 640,
    height: 480,
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: dimensions })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const detect = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(useTiny)
        .withFaceExpressions()
        .withFaceDescriptors();

      if (detections.length > 0) {
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, dimensions.width, dimensions.height);

        detections.forEach((detection) => {
          const resizedDetections = faceapi.resizeResults(
            detection,
            dimensions
          );
          showDetections(resizedDetections);
          console.log("Resize", resizedDetections);
          setResultExpression(
            resizedDetections.expressions.asSortedArray()[0].expression
          );
        });
      } else {
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, dimensions.width, dimensions.height);
        setResultExpression("");
      }
    }, 200);
  };

  const showDetections = (detection) => {
    faceapi.matchDimensions(canvasRef.current, dimensions);
    const resizedDetections = faceapi.resizeResults(detection, dimensions);
    const minProbability = 0.05;

    const drawBox = new faceapi.draw.DrawBox(
      resizedDetections.detection.box,
      "lineWidth: 3"
    );
    drawBox.draw(canvasRef.current);

    // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
    faceapi.draw.drawFaceExpressions(
      canvasRef.current,
      resizedDetections,
      minProbability
    );
  };

  return (
    <section>
      <div className="container">
        <div className="detection">
          <video autoPlay muted ref={videoRef} onPlay={detect} />
          <canvas ref={canvasRef} />
        </div>
        <div className="expression">
          <p>Resultant Expression:</p>
          <div ref={expressionRef} className="expression-text">
            {resultExpression}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaceDetection;
