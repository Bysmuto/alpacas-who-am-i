import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { NAMES, rotationFor } from '../names'

export default function Select() {
  const [taken, setTaken] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('players').select('name').then(({ data }) => {
      setTaken(data.map((p) => p.name))
    })
  }, [])

  const join = async (name) => {
    const { data } = await supabase.from('players').insert({ name }).select().single()
    localStorage.setItem('playerId', data.id)
    navigate('/waiting')
  }

  const startOver = async () => {
    await supabase.from('players').delete().neq('name', '')
    setTaken([])
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-6">
      <div className="text-center">
        <h1 className="font-display text-6xl titles drop-shadow-sm">What Alpaca Am I ?</h1>
        <p className="font-sans subTitles mt-4">selecione seu nome :</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl">
        {NAMES.map((name, i) => (
          <button
            key={name}
            disabled={taken.includes(name)}
            onClick={() => join(name)}
            className={`relative font-sans font-semibold font- text-stone-800
              px-5 py-6 rounded-sm shadow-lg shadow-black/30
              enabled:hover:scale-105 enabled:hover:rotate-0 transition 
              disabled:opacity-30 disabled:cursor-not-allowed nameTags`}
          >
           
            {name}
          </button>
        ))}
      </div>

      <button onClick={startOver} className="font-sans text-sm subTitles hover:text-amber-200/70 transition">
        Start over
      </button>
    </div>
  )
}
