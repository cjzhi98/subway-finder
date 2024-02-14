"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import { useState, useCallback, useEffect } from "react";
import LeafletWrapper from "../components/map";

const iconUrl = "/marker-icon-2x.png";

const icon = new Leaflet.Icon({
	iconUrl,
	iconAnchor: [5, 55],
	popupAnchor: [10, -44],
	iconSize: [25, 41],
});

function App() {
	const api_host = process.env.API_HOST || "http://localhost:5001";
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const askQuestion = async () => {
		setIsLoading(true);
		fetch(`${api_host}/question?question=${question}`)
			.then((res) => res.json())
			.then((data) => {
				setIsLoading(false);
				setAnswer(data.answer);
			})
			.catch((err) => {
				setIsLoading(false);
				console.log(err);
			});
	};

	const [center, setCenter] = useState([3.133075, 101.687034]);
	const [markers, setMarkers] = useState([]);

	const fetchMarkers = useCallback(() => {
		fetch(`${api_host}/subways?lat=${center[0]}&lng=${center[1]}`)
			.then((res) => res.json())
			.then((data) => {
				setMarkers(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [center]);

	const handleDragEnd = useCallback((newCenter) => {
		setCenter(newCenter);
		fetch(`${api_host}/subways?lat=${center[0]}&lng=${center[1]}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setMarkers(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		fetchMarkers();
	}, [fetchMarkers]);

	return (
		<>
			<div className="flex flex-col items-center justify-center mt-[50px]">
				<input
					type="text"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					className="mb-4 p-2 border-2 border-gray-300 rounded-md"
					placeholder="Ask a question"
				/>
				<button
					onClick={askQuestion}
					className="mb-4 p-2 bg-blue-500 text-white rounded-md"
				>
					Submit
				</button>

				{isLoading ? (
					<div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
				) : (
					answer && (
						<div className="p-4 bg-green-100 border-2 border-green-500 rounded-md">
							{answer}
						</div>
					)
				)}
			</div>

			<div className="flex items-center justify-center h-screen">
				<LeafletWrapper
					center={center}
					zoom={13}
					markers={markers}
					handleDragEnd={handleDragEnd}
					icon={icon}
					className="w-[1200px] h-[600px]"
				/>
			</div>
		</>
	);
}

export default App;
