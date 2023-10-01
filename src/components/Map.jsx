import styles from "./Map.module.css";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useGeolocation} from "../hooks/useGeoLocation";
import Button from "./Button";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {useCities} from "../context/citiesContext";
import {useUrlPosition} from "../hooks/useUrlPosition";

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {cities} = useCities();
  const [mapLat, mapLng] = useUrlPosition();

  const {
    position: geoLocationPosition,
    getPosition,
    isLoading,
  } = useGeolocation();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoading ? "...Loading" : "use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition}></ChangeCenter>
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({position}) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
// anu navigate-it gadava urlShi im lat lng-ze, romelzec davawkapunebt
// da formshi im qalaqs amoagdebs

export default Map;
