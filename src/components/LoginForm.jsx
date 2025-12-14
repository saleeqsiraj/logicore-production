import React, { useState } from 'react'
import '../styles/LoginForm.css'

export default function LoginForm({ onLogin, isLoading, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🚀 LogiCore</h1>
          <p>Enterprise Fleet Management System</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="demo@logicore.com"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="DemoPass@123"
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>📧 demo@logicore. com</p>
          <p>🔐 DemoPass@123</p>
        </div>
      </div>
    </div>
  )
}
