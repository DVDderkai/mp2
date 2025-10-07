import axios from 'axios';

const api = axios.create({ baseURL: 'https://pokeapi.co/api/v2' });

export type PokemonListItem = { id: number; name: string; image: string; };

export type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: { name: string; base: number }[];
  sprites: { artwork: string | null; front: string | null };
};

export const getIdFromUrl = (url: string) => {
  const m = url.match(/\/pokemon\/(\d+)\/?/);
  return m ? Number(m[1]) : NaN;
};

export async function getPokemonList(limit=200, offset=0): Promise<PokemonListItem[]> {
  const { data } = await api.get(`/pokemon`, { params: { limit, offset }});
  return data.results.map((r: {name:string; url:string}) => {
    const id = getIdFromUrl(r.url);
    return {
      id,
      name: r.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    };
  });
}

export async function getPokemonDetails(idOrName: string|number): Promise<PokemonDetails> {
  const { data } = await api.get(`/pokemon/${idOrName}`);
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t: any)=> t.type.name),
    abilities: data.abilities.map((a:any)=> a.ability.name),
    stats: data.stats.map((s:any)=> ({ name: s.stat.name, base: s.base_stat })),
    sprites: {
      artwork: data.sprites.other['official-artwork'].front_default,
      front: data.sprites.front_default
    }
  };
}

export async function getTypes(): Promise<string[]> {
  const { data } = await api.get(`/type`);
  return data.results
    .map((t: {name:string})=>t.name)
    .filter((n:string)=> n!=='unknown' && n!=='shadow');
}

export async function getPokemonByType(typeName: string): Promise<PokemonListItem[]> {
  const { data } = await api.get(`/type/${typeName}`);
  return data.pokemon.slice(0, 300).map((p:any)=>{
    const id = getIdFromUrl(p.pokemon.url);
    return {
      id,
      name: p.pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    };
  });
}

export async function getPokemonPage(limit = 60, offset = 0): Promise<{ items: PokemonListItem[]; total: number }> {
  const { data } = await api.get(`/pokemon`, { params: { limit, offset } });
  const items: PokemonListItem[] = data.results.map((r: { name: string; url: string }) => {
    const id = getIdFromUrl(r.url);
    return {
      id,
      name: r.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    };
  });
  return { items, total: data.count };
}

