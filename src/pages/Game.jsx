import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { rotationFor } from '../names'
import { useNavigate } from 'react-router-dom'



export default function Game() {
  const [players, setPlayers] = useState([])
  const playerId = localStorage.getItem('playerId')

  const navigate = useNavigate()

  const fetchPlayers = async () => {
    const { data } = await supabase.from('players').select('*').order('name')
    setPlayers(data)
  }

 const startOver = async () => {
    await supabase.from('players').delete().neq('name', '')
    // setTaken([])
 navigate('/')
  }



  useEffect(() => {
    fetchPlayers()
    const channel = supabase
      .channel('game-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, fetchPlayers)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center gap-10 p-6">
      <h1 className="font-display text-5xl titles mt-4">What Alpaca Am I ?</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
        {players.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-3">
            {p.id === playerId ? (
              <div className="w-[200px] h-[200px] rounded-md  bg-white border-4 border-[#02587a] flex items-center justify-center  text-5xl text-[#02587a] ">
                ?
              </div>
            ) : (
              <img
                src={p.character_image}
                className="w-[200px] h-[200px] rounded-md object-cover bg-white border-4 border-[#02587a]"
              />
            )}

            <div
              className={`relative font-sans font-semibold text-stone-800 bg-yellow-200 
                px-4 py-2 rounded-sm shadow-lg shadow-black/30 nameTags`}
            >
              <span className="pin absolute -top-1.5 left-1/2 -translate-x-1/2" />
              {p.name}
            </div>
          </div>
        ))}
      </div>
       <button onClick={startOver} className="font-sans text-sm text-amber-200/40 hover:text-amber-200/70 transition">
        Start over
      </button>
    </div>
  )
}
