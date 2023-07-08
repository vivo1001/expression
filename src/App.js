import './styles/App.css'
import React, {useState} from 'react'
import FaceDetection from './FaceDetection.js'

function App() {
	const [Face] = useState({})
	let [Available] = useState(false)


	return (
		<div>
			<div className="glitch-wrapper">
				<div className="glitch" data-glitch="Expressions">Expressions</div>
			</div> 
			
			<FaceDetection data={Face} available={Available} />
			<br/>
			<div className="footer">
				Face and emotion recognition app created by Vivek H
            </div>
		</div>

	)
}

export default App
