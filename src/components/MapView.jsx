import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

function LocationMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16, { animate: true }); // focus and zoom in
    }
  }, [position, map]);

  if (!position) return null;
  return <Marker position={position} />;
}

export default function MapView() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setPosition([coords.latitude, coords.longitude]),
        (err) => alert('Error fetching location: ' + err.message)
      );
    } else {
      alert('Geolocation not supported');
    }
  }, []);

  return (
    <MapContainer
      center={position || [20, 80]} // fallback location
      zoom={13}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', zIndex: 0 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} />
    </MapContainer>
  );
}
