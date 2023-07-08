import React, { useState } from 'react'
import FaceDetection from './FaceDetection'

const MainScreen = () => {

  return (
    <div>
    <div className="glitch-wrapper">
        <div className="glitch" data-glitch="Expressions">Expressions</div>
    </div> 
    
    <FaceDetection />
    <br/>

</div>
  )
}

export default MainScreen
