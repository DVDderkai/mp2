import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';
import './styles/App.css';

export default function App(){
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace/>}/>
        <Route path="/list" element={<ListView/>}/>
        <Route path="/gallery" element={<GalleryView/>}/>
        <Route path="/detail/:id" element={<DetailView/>}/>
        <Route path="*" element={<Navigate to="/list" replace/>}/>
      </Routes>
    </div>
  );
}
