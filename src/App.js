import MainScreen from './components/MainScreen'
import Welcome from './components/Welcome'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
return (
	<BrowserRouter>
		<Routes>
			<Route path = "/" element={<Welcome/>} />
			<Route path = "Main" element={<MainScreen/>} />
		</Routes>
	</BrowserRouter>
	)
}

export default App
