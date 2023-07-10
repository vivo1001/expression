import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { styled } from "styled-components";
import emotionClassifier from "./emotions";
import LoadingScreen from "./LoadingScreen";

const FaceDetection = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(false);
  const [resultExpression, setResultExpression] = useState(
    "The model is processing. Please wait...."
  );
  // const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const useTiny = true;

  useEffect(() => {
    const loadModels = async () => {
      const url = process.env.PUBLIC_URL + "/models";
      await faceapi.loadTinyFaceDetectorModel(url);
      await faceapi.loadFaceLandmarkTinyModel(url);
      await faceapi.loadFaceExpressionModel(url);
      await faceapi.loadFaceRecognitionModel(url);
      console.log("Models loaded");
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 3000);
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

  // const toggleVideo = () => {
  //   // const video = videoRef.current;
  //   // if (!video.paused) {
  //   //   video.pause();
  //   // } else {
  //   //   video.play();
  //   // }
  //   setIsVideoPlaying(!isVideoPlaying);
  //   console.log("Button", isVideoPlaying);
  // };

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
          setResult(true);
          console.log("Result", resizedDetections);
          showDetections(resizedDetections);
          setResultExpression(
            resizedDetections.expressions.asSortedArray()[0].expression
          );
          // emotionClassifier(resizedDetections.expressions.asSortedArray()[0].expression);
        });
      } else {
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, dimensions.width, dimensions.height);
        setResultExpression(null);
      }
    }, 2000);
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

    faceapi.draw.drawFaceExpressions(
      canvasRef.current,
      resizedDetections,
      minProbability
    );
  };

  return (
    <>
    {isLoading ? (
      <LoadingScreen/>
        ) : (
          <Screen>
      <ContainerLeft>
            <Detection>
              <Webcam autoPlay muted ref={videoRef} onPlay={detect} />
              <Canvas ref={canvasRef} />
            </Detection>
            {/* 
          <Button>
            <ToggleVideo onClick={toggleVideo}>
              {isVideoPlaying ? "Stop Video" : "Start Video"}
            </ToggleVideo>
          </Button> */}

            <Resultant>
            {!result && resultExpression}
              {result &&((resultExpression)
                ? `Your face is now ${resultExpression}`
                : "Please show your face clearly")}
            </Resultant>
      </ContainerLeft>

      <ContainerRight>
        <h1>Mood Description</h1>
        <Smiley
          src={emotionClassifier.getSmiley(resultExpression)}
        />
        <p>
          {emotionClassifier.getDescription(resultExpression)}
        </p>

        {result && <>
          <p style={{ fontWeight: 600, fontSize: 25 }}>
          Here are some songs suited for your mood
        </p>
        <a href="https://open.spotify.com/playlist/3gIvkqkbZFGYgBVivMYjHu?si=fe1ed45e62b04fa6">
          Spotify Songs
        </a>
        </>}
      </ContainerRight>

      <BgVideo
        autoPlay
        loop
        muted
        playsInline
        src={require("../assets/bgVideo.mp4")}
        className="bg-video"
      />
    </Screen>
        )}
        </>
  );
};

export default FaceDetection;

const Screen = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ContainerLeft = styled.div`
  flex-direction: column;
  width: 640px;
`;

const BgVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;


const Detection = styled.div`
  display: flex;
  color: white;
`;

// const BlackScreen = styled.div`
//   width: 640px;
//   height: 480px;
//   background-color: black;
//   border-radius: 10px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 24px;
//   font-weight: 200;
// `;

const Webcam = styled.video`
  border-radius: 10px;
  border-color: black;
  border-width: 1;
`;

const Canvas = styled.canvas`
  position: absolute;
`;

// const Button = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 640px;
//   margin-top: 3vh;
// `;

// const ToggleVideo = styled.button`
//   width: 10vw;
//   height: 5vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border-radius: 20px;
//   font-size: 20px;
//   background-color: #9be8d8;

//   &:active {
//     background-color: #9bec;
//     width: 9.5vw;
//   }
// `;

const Resultant = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3vh;
  font-size: 30px;
  background-color: #e9ffc2;
  height: 10vh;
  border-radius: 50px;
`;

const ContainerRight = styled.div`
  margin-top: 6vh;
  background-color: #c3edc0;
  width: 40vw;
  height: 90vh;
  border-radius: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  & > h1 {
    color: #1a5d1a;
    margin-top: 2vh;
    font-family: Roboto, cursive;
  }

  & > p {
    margin: 20px 30px;
    font-size: 18px;
    font-weight: 400;
  }
`;
const Smiley = styled.img`
  margin-top: 5vh;
  width: 120px;
  height: 120px;
  border-radius: 120px;
  z-index: 999;
`;
