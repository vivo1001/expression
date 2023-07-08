import React, { useRef, useEffect } from 'react'
import '../styles/FaceDetection.css'
import * as faceapi from 'face-api.js'

const FaceDetection = ({ data, available }) => {
	const videoRef = useRef()
	const canvasRef = useRef()

	const useTiny = true
	let initialized = false
	const minConfidence = 0.7
		
	let objExpressionDescriptors = {}

	useEffect(() => {
		const loadModels = async () => {
			const url = process.env.PUBLIC_URL + '/models'
			await faceapi.loadTinyFaceDetectorModel(url)
			await faceapi.loadFaceLandmarkTinyModel(url)
			await faceapi.loadFaceExpressionModel(url)
			await faceapi.loadFaceRecognitionModel(url)
			console.log('Models loaded')
		}
		loadModels()

		getVideo()
	}, [])

	const dimensions = {
		width: 640,
		height: 480,
	}

	const getVideo = () => {
		
		navigator.mediaDevices
			.getUserMedia({ video: dimensions })
			.then(stream => {
				videoRef.current.srcObject = stream
			})
			.catch(err => {
				console.error('error:', err)
			})
	}

	const detect = async () => {

		setInterval(async () => {
			// .detectSingleFace(videoRef.current, new faceapi.getFaceDetectorOptions())
			const detection = await faceapi
				.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
				.withFaceLandmarks(useTiny)
				.withFaceExpressions()
				.withFaceDescriptor()

			if (detection) {
				// console.log("Entered detection section!");
				const resizedDetections = faceapi.resizeResults(detection, dimensions)

				Object.keys(resizedDetections.expressions).forEach(key => {
					if (resizedDetections.expressions[key] > minConfidence && initialized === false)
						if (!objExpressionDescriptors.hasOwnProperty(key)) {
							console.log('Detection:', JSON.stringify(detection))
							console.log('Resized Detections:', key, JSON.stringify(resizedDetections.descriptor))

							// check if face expression not fulfilled yet
							objExpressionDescriptors[key] = resizedDetections.descriptor // update fullfilled face expressions
							// trigger event each new expression detected

						}
				})
			}
			if (detection !== undefined) showDetections(detection)//, Present[0])
		}, 2000)
	}

	const showDetections = (detection) => {
		faceapi.matchDimensions(canvasRef.current, dimensions)
		const resizedDetections = faceapi.resizeResults(detection, dimensions)
		const minProbability = 0.05
		canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
		canvasRef.current.getContext('2d').clearRect(0, 0, dimensions.width, dimensions.height)


		const drawBox = new faceapi.draw.DrawBox(resizedDetections.detection.box, 'lineWidth: 3')
		drawBox.draw(canvasRef.current)

		faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
		faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
		faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections, minProbability)
	}


	return (
		<section>
			<div className="detection">
				<video autoPlay muted ref={videoRef} onPlay={detect} />
				<canvas ref={canvasRef} />
				
			</div>

		</section>
	)
	
}

export default FaceDetection
