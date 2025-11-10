import { Routes, Route, Link, useLocation } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'

export default function App() {
  const location = useLocation()

  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="title">🎌 Anime Search</Link>
        <a href="https://docs.api.jikan.moe" target="_blank" rel="noreferrer">Jikan API</a>
      </header>

      {/* Route transition wrapper OUTSIDE of <Routes> */}
      <div className="route-container" key={location.pathname}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/anime/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </div>
  )
}
