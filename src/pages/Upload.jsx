import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Upload() {
  const [target, setTarget] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const playerId = localStorage.getItem('playerId')
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single()
      .then(async ({ data }) => {
        const { data: targetPlayer } = await supabase.from('players').select('*').eq('id', data.target_id).single()
        setTarget(targetPlayer)
      })
  }, [])

  const pickFile = (e) => {
    const f = e.target.files[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const submit = async () => {
    const path = `${target.id}-${Date.now()}`
    await supabase.storage.from('characters').upload(path, file)
    const { data } = supabase.storage.from('characters').getPublicUrl(path)
    await supabase.from('players').update({ character_image: data.publicUrl }).eq('id', target.id)
    navigate('/game')
  }

  if (!target) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="font-display text-5xl titles text-center ">
       Escolha um personagem para : <span className="text-[#02587a]">{target.name}</span>
      </h1>
      

      <div className="relative text-stone-800 rounded-sm shadow-lg shadow-black/30 p-6 flex flex-col items-center gap-4 w-72 nameTags">
        <span className="pin absolute -top-1.5 left-1/2 -translate-x-1/2" />

        {preview ? (
          <img src={preview} className="w-40 h-40 object-cover rounded-sm shadow" />
        ) : (
          <div className="w-40 h-40 rounded-sm bg-stone-300 flex items-center justify-center font-display text-4xl text-stone-500">
            ?
          </div>
        )}

        <label className="font-sans text-sm font-semibold px-4 py-2 bg-stone-800 text-amber-50 rounded-sm cursor-pointer hover:bg-stone-700 transition">
          selecione
          <input type="file" accept="image/*" onChange={pickFile} className="hidden" />
        </label>
      </div>

      <button
        disabled={!file}
        onClick={submit}
        className="font-sans font-semibold px-8 py-3 bg-green-600 text-amber-50 rounded-sm shadow-lg shadow-black/30 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        continuar
      </button>
    </div>
  )
}
