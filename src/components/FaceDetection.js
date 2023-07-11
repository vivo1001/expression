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
  const [isDetecting, setIsDetecting] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [resultExpression, setResultExpression] = useState(
    "Click on the button please!"
  );
  const [intervalId, setIntervalId] = useState(null); // New state variable

  const useTiny = true;

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

  const handleDetectClick = () => {
    // console.log("Detect",isDetecting);
    var myVideo = document.getElementById("camera");
    if (isDetecting) {
      clearInterval(intervalId);
      setIsDetecting(false);
      setResultExpression("Click on the button please!");
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, dimensions.width, dimensions.height);
      myVideo.pause();
    } else {
      setResultExpression("The model is processing. Please wait....");
      myVideo.play();
      const id = setInterval(detect, 1000);
      setIntervalId(id);
      setIsDetecting(true);
    }
  };

  const detect = async () => {
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
        const resizedDetections = faceapi.resizeResults(detection, dimensions);
        setResult(true);
        console.log("Result", resizedDetections);
        showDetections(resizedDetections);
        setResultExpression(
          `You are now ${
            resizedDetections.expressions.asSortedArray()[0].expression
          }`
        );
        setEmotion(resizedDetections.expressions.asSortedArray()[0].expression);
      });
    } else {
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, dimensions.width, dimensions.height);
      setResultExpression("Please show your face clearly");
      setEmotion("");
    }
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
		faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
    faceapi.draw.drawFaceExpressions(
      canvasRef.current,
      resizedDetections,
      minProbability
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Screen>
          <ContainerLeft>
            <Detection>
              <Webcam id="camera" autoPlay muted ref={videoRef} />
              <Canvas ref={canvasRef} />
            </Detection>

            <Button onClick={handleDetectClick}>
              {isDetecting ? "Stop" : "Start"} Detection
            </Button>
            <Resultant>{resultExpression}</Resultant>
          </ContainerLeft>

          <ContainerRight>
            <h1>Mood Description</h1>
            <SmileyWrapper>
              <Smiley src={emotionClassifier.getSmiley(emotion)} />
              {emotion.toUpperCase()}
            </SmileyWrapper>
            <p style={{ color: "#2F0F5D", fontFamily: "Roboto, cursive" }}>
  {emotionClassifier.getDescription(emotion)}
</p>


            {result && (
              <>
                <p style={{ fontWeight: 400, fontSize: 25 , fontFamily:"Roboto, cursive" }}>
                  Here are some songs suited for your mood
                </p>
                <Spotify>
                <SpotifyLogo src={require("../assets/spotify.png")}/>
                <a href={`${emotionClassifier.getSongs(emotion)}`}>
                  Open Spotify
                </a>
                </Spotify>
              </>
            )}
          </ContainerRight>

          <BgVideo
            autoPlay
            loop
            muted
            playsInline
            src={emotionClassifier.getBgVideo(emotion)}
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
  margin-top: 6vh;
  flex-direction: column;
  width: 640px;
  display: flex;
  align-items: center;

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

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 6vh;
  margin-top: 3vh;
  border-radius: 30px;
  font-size: 20px;
  background-color: #ff0060;
  color: #f6fa70;
  border-width: 0.1;

  &:active {
    background-color: #b70404;
    color: #f2be22;
  }
`;

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
  width: 100%;
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
  background-color: #e9ffc2;
  width: 40vw;
  height: 90vh;
  border-radius: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  flex-wrap:wrap;

  & > h1 {
    color: #2f0f5d;
    margin-top: 2vh;
    font-family: Roboto, cursive;
  }

  & > p {
    margin: 20px 30px;
    font-size: 17px;
    font-weight: 200;
    font-family: Roboto, cursive;
    color:#2F0F5D
  }

  & > a {
    text-decoration:none;
    font-size:20px;
    color:green;

  }
`;

const Spotify = styled.button`
    display:flex;
    width: 30%;
    background-color: #16FF00;
    justify-content:space-evenly;
    height:40px;
    align-items:center;
    border-radius:30px;
 & > a {
    text-decoration:none;
    font-size:20px;
    color:black;
  }
  &:active{
    background-color:#239D60;
  }
`;

const SpotifyLogo = styled.img`
    width:30px;
    height:30px;
    border-radius:30px;
    background-color:black;
`;

const SmileyWrapper = styled.div`
  margin-top: 5vh;
  flex-direction: row;
  display: flex;
  align-items: center;
  width: 50%;
  justify-content: space-evenly;
  font-size: 20px;
  font-weight: 600;
  font-family: Roboto-mono , sans-serif;
`;

const Smiley = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 120px;
`;
