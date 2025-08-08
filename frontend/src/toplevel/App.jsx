import React, { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch(API + '/health').then(r=>r.json()).then(d=>setStatus('OK ' + d.time)).catch(()=>setStatus('OFF'))
  }, [])

  async function login(e){
    e.preventDefault()
    const r = await fetch(API + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await r.json()
    if (data.token) setToken(data.token)
    else alert(data.error || 'Login failed')
  }

  async function loadEntries(){
    const r = await fetch(API + '/api/entries', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await r.json()
    setEntries(data)
  }

  return (
    <div style={{fontFamily:'sans-serif', margin:'20px'}}>
      <h1>Mr. Sticker</h1>
      <p>API status: {status}</p>

      {!token && (
        <form onSubmit={login} style={{marginBottom:'20px'}}>
          <h3>Login</h3>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Login</button>
          <p style={{fontSize:12, opacity:0.7}}>اولین‌بار باید با API کاربر بسازیم؛ یا من برایت ادمین می‌سازم.</p>
        </form>
      )}

      {token && (
        <div>
          <button onClick={loadEntries}>Load latest entries</button>
          <ul>
            {entries.map(e => (
              <li key={e._id}>{e.date} — OBD: {e.obd}, Safety: {e.safety}, Labor: ${e.labor_total}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
