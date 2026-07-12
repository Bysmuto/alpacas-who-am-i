import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { rotationFor } from '../names'

export default function Waiting() {
  const [players, setPlayers] = useState([])
  const playerId = localStorage.getItem('playerId')
  const navigate = useNavigate()

  const fetchPlayers = async () => {
    const { data } = await supabase.from('players').select('*').order('created_at')
    setPlayers(data)
    const me = data.find((p) => p.id === playerId)
    if (me?.target_id) navigate('/upload')
  }

  useEffect(() => {
    fetchPlayers()
    const channel = supabase
      .channel('waiting-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, fetchPlayers)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const setReady = async () => {
    await supabase.from('players').update({ ready: true }).eq('id', playerId)

    const { data } = await supabase.from('players').select('*')
    const allReady = data.every((p) => p.ready)
    if (allReady && data.length >= 2) {
      const shuffled = [...data].sort(() => Math.random() - 0.5)
      for (let i = 0; i < shuffled.length; i++) {
        const target = shuffled[(i + 1) % shuffled.length]
        await supabase.from('players').update({ target_id: target.id }).eq('id', shuffled[i].id)
      }
    }
  }

  const me = players.find((p) => p.id === playerId)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="font-display text-5xl titles">Sala de espera</h1>

      <div className="flex flex-col gap-4">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`relative font-sans flex items-center justify-between gap-10 w-64 px-5 py-3
              text-stone-800 rounded-sm shadow-lg shadow-black/30 nameTags`}
          >
            <span className="pin absolute -top-1.5 left-1/2 -translate-x-1/2" />
            <span className="font-semibold">{p.name}</span>
            <span className={p.ready ? 'text-green-500' : 'text-white/50'}>
              {p.ready ? 'Ready' : 'Waiting'}
            </span>
          </div>
        ))}
      </div>

      {!me?.ready && (
        <button
          onClick={setReady}
          className="font-sans font-semibold px-8 py-3 bg-green-600 text-amber-50 rounded-sm shadow-lg shadow-black/30 hover:bg-red-500 transition"
        >
          I'm ready
        </button>
      )}
      {me?.ready && <p className="font-sans subTitles">Esperando os cornos...</p>}
    </div>
  )
}
