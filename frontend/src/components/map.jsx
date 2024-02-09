// LeafletWrapper.js
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

function MapEvents({ onDragEnd }) {
	const { useMapEvents } = require("react-leaflet");
	const map = useMapEvents({
		dragend: () => {
			const newCenter = map.getCenter();
			onDragEnd([newCenter.lat, newCenter.lng]);
		},
	});

	return null;
}

function LeafletWrapper(props) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		return () => {
			setIsMounted(false);
		};
	}, []);

	if (!isMounted) {
		return null;
	}

	const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
	const { center, zoom, markers, handleDragEnd, icon, className } = props;

	return (
		<MapContainer center={center} zoom={zoom} className={className}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{markers &&
				markers.length > 0 &&
				markers.map((marker) => (
					<Marker
						key={marker.subway_id}
						position={[marker.lat, marker.lng]}
						icon={icon}
					>
						<Popup>
							<div>
								<h2 className="text-2xl font-bold text-blue-700">
									{marker.name}
								</h2>
								<p className="text-lg text-gray-600">
									{marker.address}
								</p>
								<a
									href={`${marker.waze}`}
									className="flex items-center text-blue-500 hover:text-blue-700"
								>
									<img
										src="/waze.png"
										alt="Waze icon"
										className="mr-2 w-[50px] h-[50px]"
									/>
								</a>
							</div>
						</Popup>
					</Marker>
				))}
			<MapEvents onDragEnd={handleDragEnd} />
		</MapContainer>
	);
}

export default LeafletWrapper;
