import React, { useState } from 'react'
import FaceDetection from './FaceDetection'
import { styled } from 'styled-components';

const MainScreen = () => {

  return (
    <Container>
    <FaceDetection />
</Container>
  )
}

const Container = styled.div`
  ${'' /* flex:1; */}

`;
export default MainScreen
