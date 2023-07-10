import FaceDetection from './components/FaceDetection';
import Welcome from './components/Welcome'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
return (
	<BrowserRouter>
		<Routes>
			<Route path = "/" element={<Welcome/>} />
			<Route path = "Main" element={<FaceDetection/>} />
		</Routes>
	</BrowserRouter>
	)
}

export default App
