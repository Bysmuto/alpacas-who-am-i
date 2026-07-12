import { HashRouter, Routes, Route } from 'react-router-dom'
import Select from './pages/Select'
import Waiting from './pages/Waiting'
import Upload from './pages/Upload'
import Game from './pages/Game'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Select />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </HashRouter>
  )
}
