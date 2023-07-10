import React, { useState } from "react";
import styled from "styled-components";
import colorAnimation from "../assets/animation";

const Welcome = () => {
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const buttonPress = () => {
    setIsButtonPressed(true);
    // Delay the navigation to MainScreen for a brief moment to allow the highlight effect to be visible
    setTimeout(() => {
      window.location.href = "/Main";
    }, 200);
  };

  return (
    <Container>
      <Heading>
        <Text>Expressions</Text>
        <Caption>Capture your face</Caption>
      </Heading>

      <WrapperContent>
        <Image src={require("../assets/smile.jpg")} />

        <Description>
          Expressions is an emotion and face recognition web app that works with
          the help of AI. To achieve this, I have used a public API called
          face-api.js which provides various functionalities such as emotion
          detection and face landmark functionalities. More details of the
          project can be found in Introduction.md file.
        </Description>

        <Button onClick={buttonPress} isPressed={isButtonPressed}>
          Proceed to Expressions
        </Button>
      </WrapperContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 100vh;
  background-color:#98EECC;
  border-radius: 1px;
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  z-index: 999;

  @media (max-width: 720px) {
    width: 100%;
    height: auto;
  }

  @media (max-width: 480px) {
    font-size: 40px;
  }
`;


const WrapperContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  animation: ${colorAnimation} 2s linear infinite;

  @media (max-width: 720px) {
    width: 100%;
    padding: 20px;
  }
`;

const Text = styled.div`
  font-size: 60px;
  font-family: sans-serif Roboto;
  font-weight: 600;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);

  @media (max-width: 480px) {
    font-size: 30px;
  }
`;

const Caption = styled.div`
  margin-top: 10px;
  font-size: 24px;
  color: white;
  font-family: "Dancing Script", cursive;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
`;

const Image = styled.img`
  width: 30vh;
  border-radius: 30vh;
`;

const Description = styled.div`
  width: 80%;
  margin-top: 8vh;
  font-family: sans-serif Roboto;
  font-size: 20px;
  font-weight: 400;
  color:#03001C;
`;

const Button = styled.button`
  margin-top: 10vh;
  width: 60%;
  height: 10vh;
  background-color: ${(props) =>
    props.isPressed ? "rgba(55, 157, 179, 0.4)" : "rgba(55, 157, 179, 1)"};
  border-radius: 60px;
  border-width: 0;
  box-shadow: 0 4px rgba(0, 0, 0, 0.4);
  font-size: 25px;
  color: white;

  @media (max-width: 720px) {
    width: 100%;
  }

  &:active {
    background-color: rgba(55, 157, 179, 0.4);
  }
`;

export default Welcome;
