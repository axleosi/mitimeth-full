'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css'; 

const Map = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [38, 38],
  });

  return (
    <div className={styles.mapCon}>
      <MapContainer
        center={[6.444474, 3.427954]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[6.444574, 3.427954]} icon={customIcon} />
      </MapContainer>
    </div>
  );
};

export default Map;
