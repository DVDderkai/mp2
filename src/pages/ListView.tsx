import { useEffect, useMemo, useState } from 'react';
import { getPokemonList, PokemonListItem } from '../api';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';
import '../styles/List.css';

export default function ListView() {
  const [all, setAll] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<'id'|'name'>('id');
  const [dir, setDir] = useState<'asc'|'desc'>('asc');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 一次性请求全部宝可梦（limit=100000）
        const data = await getPokemonList(100000, 0);
        setAll(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const norm = q.trim().toLowerCase();
    let arr = norm ? all.filter(p => p.name.includes(norm) || String(p.id).includes(norm)) : all.slice();
    arr.sort((a, b) => {
      const v = sortKey === 'id' ? (a.id - b.id) : a.name.localeCompare(b.name);
      return dir === 'asc' ? v : -v;
    });
    return arr;
  }, [all, q, sortKey, dir]);

  if (loading) return <Loading />;

  return (
    <div className="page list-page">
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by name or #id"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <div className="sorters">
          <label>Sort by:</label>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as any)}>
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
          <button className="btn" onClick={() => setDir(d => d === 'asc' ? 'desc' : 'asc')}>
            {dir === 'asc' ? 'Asc ↑' : 'Desc ↓'}
          </button>
        </div>
      </div>

      <div className="grid">
        {filtered.map(p => (
          <PokemonCard key={p.id} {...p} />
        ))}
      </div>

      {!loading && all.length === 0 && (
        <div className="end">No Pokémon found.</div>
      )}
    </div>
  );
}
