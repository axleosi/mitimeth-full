'use client'
import React from 'react'
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';




const Map = () => {
  const customIcon=new Icon({
    iconUrl:'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize:[38,38]
  })
  return (
   <div className={styles.mapCon}>
    <MapContainer center={[6.444474,3.427954]} zoom={13} style={{height:'100%', width:'100%'}}>
      <TileLayer
       url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[6.444574,3.427954]} icon={customIcon}></Marker>
    </MapContainer>
   </div>
  )
}

export default Map