import { useEffect, useState } from 'react';
import { getPokemonList, getTypes, getPokemonByType, PokemonListItem } from '../api';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';
import '../styles/Gallery.css';

export default function GalleryView(){
  const [all, setAll] = useState<PokemonListItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState<PokemonListItem[]>([]);

  useEffect(()=>{
    (async ()=>{
      try{
        const [list, t] = await Promise.all([ getPokemonList(151), getTypes() ]);
        setAll(list);
        setDisplay(list);
        setTypes(t);
      } finally{ setLoading(false); }
    })();
  },[]);

  useEffect(()=>{
    (async ()=>{
      if(picked.length===0){ setDisplay(all); return; }
      const batches = await Promise.all(picked.map(name=> getPokemonByType(name)));
      const map = new Map<number, PokemonListItem>();
      for(const arr of batches){ for(const p of arr){ map.set(p.id, p); } }
      setDisplay(Array.from(map.values()).sort((a,b)=> a.id-b.id));
    })();
  },[picked, all]);

  if(loading) return <Loading/>;

  return (
    <div className="page gallery-page">
      <div className="filters">
        <div className="chipset">
          {types.map(t=> (
            <label key={t} className={`chip ${picked.includes(t)?'active':''}`}>
              <input
                type="checkbox"
                checked={picked.includes(t)}
                onChange={(e)=>{
                  setPicked(prev=> e.target.checked ? [...prev, t] : prev.filter(x=> x!==t));
                }}
              />
              {t}
            </label>
          ))}
        </div>
        {picked.length>0 && <button className="clear" onClick={()=> setPicked([])}>Clear</button>}
      </div>

      <div className="grid">
        {display.map(p=> <PokemonCard key={p.id} {...p}/>)}
      </div>
    </div>
  );
}
