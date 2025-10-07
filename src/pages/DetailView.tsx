import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPokemonDetails, PokemonDetails } from '../api';
import Loading from '../components/Loading';
import '../styles/Detail.css';

const MAX_ID = 898; // 可按需调整

export default function DetailView(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const currentId = Number(id);

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const d = await getPokemonDetails(id!);
        setData(d);
      } finally{ setLoading(false); }
    })();
  },[id]);

  if(loading || !data) return <Loading/>;

  const prevId = currentId>1 ? currentId-1 : 1;
  const nextId = currentId<MAX_ID ? currentId+1 : MAX_ID;

  return (
    <div className="page detail-page">
      <div className="detail-card">
        <div className="left">
          <img src={data.sprites.artwork || data.sprites.front || ''} alt={data.name} />
        </div>
        <div className="right">
          <div className="heading">
            <span className="pid">#{String(data.id).padStart(3,'0')}</span>
            <h1 className="pname">{data.name}</h1>
          </div>

          <div className="kv">
            <div><label>Types</label><div className="pills">{data.types.map(t=> <span key={t} className={`pill t-${t}`}>{t}</span>)}</div></div>
            <div><label>Height</label><span>{data.height}</span></div>
            <div><label>Weight</label><span>{data.weight}</span></div>
            <div><label>Abilities</label><div className="pills">{data.abilities.map(a=> <span key={a} className="pill">{a}</span>)}</div></div>
          </div>

          <div className="stats">
            {data.stats.map(s=> (
              <div className="stat" key={s.name}>
                <span className="sname">{s.name}</span>
                <progress className="prog" max={180} value={s.base}></progress>
                <span className="sval">{s.base}</span>
              </div>
            ))}
          </div>

          <div className="navrow">
            <button onClick={()=> navigate(`/detail/${prevId}`)} disabled={currentId===1}>← Previous</button>
            <button onClick={()=> navigate(`/detail/${nextId}`)} disabled={currentId===MAX_ID}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
