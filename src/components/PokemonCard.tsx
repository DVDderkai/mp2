import { Link } from 'react-router-dom';
import './PokemonCard.css';

type Props = { id: number; name: string; image: string; };
export default function PokemonCard({id, name, image}: Props) {
  return (
    <Link to={`/detail/${id}`} className="poke-card">
      <div className="thumb">
        <img src={image} alt={name} loading="lazy"/>
      </div>
      <div className="meta">
        <span className="id">#{String(id).padStart(3,'0')}</span>
        <h3 className="name">{name}</h3>
      </div>
    </Link>
  );
}
