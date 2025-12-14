import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'
import { transactionManager } from './services/transactionManager'
import { auditLogger } from './services/auditLogger'
import './styles/App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const saved = transactionManager.getTransactions()
    setTransactions(saved)
  }, [])

  const handleLogin = (email, password) => {
    setIsLoading(true)
    try {
      if (email === 'demo@logicore. com' && password === 'DemoPass@123') {
        const user = {
          id: 'user-' + Date.now(),
          email,
          fullName: 'Demo User',
          role: 'admin'
        }
        setUser(user)
        auditLogger.log('LOGIN', email)
        setErrors([])
      } else {
        setErrors(['Invalid email or password'])
        auditLogger.log('LOGIN_FAILED', email)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    auditLogger.log('LOGOUT', user?. email)
    setUser(null)
    setTransactions([])
  }

  const handleAddTransaction = (data) => {
    try {
      const transaction = transactionManager.createTransaction({
        ...data,
        userId: user. id
      })
      setTransactions(prev => [transaction, ...prev])
      auditLogger.log('CREATE_TRANSACTION', user.id)
      setErrors([])
    } catch (error) {
      setErrors([error.message])
    }
  }

  const handleDeleteTransaction = (id) => {
    try {
      transactionManager.deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t. id !== id))
      auditLogger.log('DELETE_TRANSACTION', user.id)
    } catch (error) {
      setErrors([error.message])
    }
  }

  const handleImportTransactions = (imported) => {
    setTransactions(prev => [...imported, ...prev])
    setErrors([])
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginForm onLogin={handleLogin} isLoading={isLoading} error={errors[0]} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Dashboard
        user={user}
        transactions={transactions}
        errors={errors}
        isLoading={isLoading}
        onAddTransaction={handleAddTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onImportTransactions={handleImportTransactions}
        onLogout={handleLogout}
      />
    </ErrorBoundary>
  )
}
