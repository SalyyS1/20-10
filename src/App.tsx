import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GiftPage from './pages/GiftPage'
import OpenGiftPage from './pages/OpenGiftPage'
import StoragePage from './pages/StoragePage'
import AudioPlayer from './components/AudioPlayer'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fce4ec',
    },
    secondary: {
      main: '#c8e6f5',
    },
    background: {
      default: '#fff5f8',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Dancing Script", cursive',
    },
    h2: {
      fontFamily: '"Dancing Script", cursive',
    },
    h3: {
      fontFamily: '"Dancing Script", cursive',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto">
        <AudioPlayer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/open" element={<OpenGiftPage />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/storage" element={<StoragePage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
