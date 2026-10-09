import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getInitialTheme() {

  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setCopied(false)

    if (!url.trim()) {
      setError('Paste a link to shorten.')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/shorten`, {
        originalUrl: url
      })
      setResult(res.data)

    } catch (e) {
      if (e.response) {
        setError(e.response.data?.error || 'Something went wrong. Try again.')
      } else {
        setError('Cannot reach the server. Check that the backend is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copy failed. Select the link and copy it manually.')
    }
  }

  function handleReset() {
    setUrl('')
    setResult(null)
    setError('')
    setCopied(false)
  }

  return (
    <main className="page">
      <header className="topbar">
        <span className="brand">Linkcut</span>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <section className="card">
        <div className="content">
          <h1 className="title">Make long links short</h1>
          <p className="subtitle">
            Paste any big link and get a short link that is easy to share.
          </p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="url" className="sr-only">
              Link to shorten
            </label>
            <input
              id="url"
              type="url"
              className="input"
              placeholder="https://example.com/a/very/long/address"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Shortening...' : 'Shorten link'}
            </button>
          </form>

          {error && (
            <p id="url-error" className="error" role="alert">
              {error}
            </p>
          )}

          {result && (
            <div className="result" >
              <p className="original" title={result.originalUrl}>
                {result.originalUrl}
              </p>
              <div className="short-row">
                <a
                  className="short-link"
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.shortUrl}
                </a>
                <button type="button" className="btn btn-copy" onClick={handleCopy}>
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
              <button type="button" className="btn-text" onClick={handleReset}>
                Shorten another link
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}