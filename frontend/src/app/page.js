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

// function MapEvents({ onDragEnd }) {
// 	const map = useMapEvents({
// 		dragend: () => {
// 			const newCenter = map.getCenter();
// 			onDragEnd([newCenter.lat, newCenter.lng]);
// 		},
// 	});

// 	return null;
// }

// function App() {
// 	const [center, setCenter] = useState([3.133075, 101.687034]);
// 	const [markers, setMarkers] = useState([]);

// 	const fetchMarkers = useCallback(() => {
// 		fetch(
// 			`http://localhost:5001/subways?lat=${center[0]}&lng=${center[1]}`,
// 			{
// 				method: "GET",
// 			}
// 		)
// 			.then((res) => res.json())
// 			.then((data) => {
// 				setMarkers(data);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}, [center]);

// 	useEffect(() => {
// 		fetchMarkers();
// 	}, [fetchMarkers]);

// 	const handleDragEnd = useCallback((newCenter) => {
// 		setCenter(newCenter);
// 		fetch(
// 			`http://localhost:5001/subways?lat=${center[0]}&lng=${center[1]}`,
// 			{
// 				method: "GET",
// 			}
// 		)
// 			.then((res) => res.json())
// 			.then((data) => {
// 				setMarkers(data);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}, []);

// 	return (
// 		<div>
// 			<div className="flex items-center justify-center h-screen">
// 				<MapContainer
// 					center={center}
// 					zoom={13}
// 					className="w-[1000px] h-[800px]"
// 					attributionControl={false}
// 				>
// 					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// 					{markers &&
// 						markers.length > 0 &&
// 						markers.map((marker) => {
// 							return (
// 								<Marker
// 									key={marker.subway_id}
// 									position={[marker.lat, marker.lng]}
// 									icon={icon}
// 								>
// 									<Popup>
// 										<div>
// 											<h2 className="text-2xl font-bold text-blue-700">
// 												{marker.name}
// 											</h2>
// 											<p className="text-lg text-gray-600">
// 												{marker.address}
// 											</p>
// 											<a
// 												href={`${marker.waze}`}
// 												className="flex items-center text-blue-500 hover:text-blue-700"
// 											>
// 												<img
// 													src="/waze.png"
// 													alt="Waze icon"
// 													className="mr-2 w-[50px] h-[50px]"
// 												/>
// 											</a>
// 										</div>
// 									</Popup>
// 								</Marker>
// 							);
// 						})}
// 					<MapEvents onDragEnd={handleDragEnd} />
// 				</MapContainer>
// 			</div>
// 		</div>
// 	);
// }

// export default App;

function App() {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const askQuestion = async () => {
		setIsLoading(true);
		fetch(`http://localhost:5001/question?question=${question}`)
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
		fetch(`http://localhost:5001/subways?lat=${center[0]}&lng=${center[1]}`)
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
		fetch(
			`http://localhost:5001/subways?lat=${center[0]}&lng=${center[1]}`,
			{
				method: "GET",
			}
		)
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
