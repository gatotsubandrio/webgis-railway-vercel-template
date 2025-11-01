import React, {useEffect, useState, useRef} from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import L from 'leaflet'

// fix icon paths for leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

function ClickHandler({onClick}) {
  useMapEvents({
    click(e){
      onClick(e)
    }
  })
  return null
}

export default function MapView(){
  const [points, setPoints] = useState([])
  const [selected, setSelected] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newCoord, setNewCoord] = useState(null)
  const mapRef = useRef()

  useEffect(()=>{
    const fetchPoints = async ()=>{
      try{
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const res = await axios.get(`${base}/api/locations`)
        setPoints(res.data)
      }catch(e){ console.error(e) }
    }
    fetchPoints()
  },[])

  const handleMapClick = (e)=>{
    if(!adding) return
    const { lat, lng } = e.latlng
    setNewCoord([lat, lng])
  }

  const submitNew = async (ev)=>{
    ev.preventDefault()
    const form = ev.target
    const name = form.name.value.trim()
    const desc = form.desc.value.trim()
    if(!name || !newCoord) return alert('Isi nama dan klik peta untuk pilih koordinat')
    try{
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      await axios.post(`${base}/api/locations`, { name, description: desc, lat: newCoord[0], lon: newCoord[1] })
      // refresh
      const res = await axios.get(`${base}/api/locations`)
      setPoints(res.data)
      setAdding(false)
      setNewCoord(null)
      form.reset()
    }catch(e){ console.error(e); alert('gagal menambah') }
  }

  return (
    <div style={{height:'100%', position:'relative'}}>
      <div className="controls">
        <button onClick={()=>{ setAdding(p=>!p); setNewCoord(null) }}>{adding ? 'Batal Tambah' : 'Tambah Lokasi'}</button>
        {adding && <form onSubmit={submitNew} style={{marginTop:8}}>
          <div><input name="name" placeholder="Nama lokasi" /></div>
          <div><input name="desc" placeholder="Deskripsi (opsional)" /></div>
          <div style={{fontSize:12,color:'#666',marginTop:6}}>Klik peta untuk memilih koordinat</div>
          <div style={{marginTop:6}}><button type="submit">Simpan</button></div>
        </form>}
        {!adding && <div style={{marginTop:8}}>Klik marker untuk lihat popup<br/>Klik 'Tambah Lokasi' untuk menambahkan</div>}
        {newCoord && <div style={{marginTop:8}}>Koordinat terpilih: {newCoord[0].toFixed(6)}, {newCoord[1].toFixed(6)}</div>}
      </div>

      <MapContainer center={[1.5, 104.5]} zoom={5} style={{height:'100%'}} whenCreated={map=>mapRef.current = map}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onClick={handleMapClick} />
        {points.map(p=>(
          <Marker key={p.id} position={[p.lat, p.lon]}>
            <Popup>
              <strong>{p.name}</strong><br/>{p.description}
            </Popup>
          </Marker>
        ))}
        {newCoord && <Marker position={[newCoord[0], newCoord[1]]} />}
      </MapContainer>
    </div>
  )
}
