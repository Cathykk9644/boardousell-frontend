import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import axios from "axios";
import { useEffect, useState } from "react";
const mapApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
type center = {
  lat: number;
  lng: number;
} | null;

export default function GoogleMap({
  location,
  setError,
}: {
  location: string;
  setError: Function;
}) {
  const [center, setCenter] = useState<center>(null);

  useEffect(() => {
    const getCenter = async () => {
      try {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${mapApiKey}`
        );
        setCenter({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        });
      } catch (error) {
        setError({
          backHome: false,
          message: "Oh. Sorry, cannot load google map for now.",
        });
      }
    };
    getCenter();
  });
  return (
    center && (
      <APIProvider apiKey={mapApiKey ? mapApiKey : ""}>
        <Map center={center} zoom={16} className="google-map">
          <Marker position={center} />
        </Map>
      </APIProvider>
    )
  );
}
