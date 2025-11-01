import React from 'react'
import MapView from './components/MapView'

export default function App(){
  return (
    <div className="app-root">
      <header className="header"><h1>WebGIS - Leaflet Demo</h1></header>
      <main className="main"><MapView /></main>
    </div>
  )
}
