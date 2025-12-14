import React, { useState, useMemo } from 'react'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import ExcelManager from './ExcelManager'
import '../styles/Dashboard.css'

export default function Dashboard({
  user,
  transactions,
  errors,
  isLoading,
  onAddTransaction,
  onDeleteTransaction,
  onImportTransactions,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('transactions')
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = useMemo(() => {
    const total = transactions.length
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    const byType = {}
    transactions.forEach(t => {
      byType[t. type] = (byType[t.type] || 0) + 1
    })
    return { total, totalAmount, average: total > 0 ? totalAmount / total : 0, byType }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType
      const matchesSearch = t.accountNumber. toLowerCase().includes(searchTerm. toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [transactions, filterType, searchTerm])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>LogiCore Dashboard</h1>
          <p>Welcome, {user.fullName}!  ({user.role})</p>
        </div>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </header>

      {errors.length > 0 && (
        <div className="error-container">
          {errors.map((err, i) => (
            <div key={i} className="error-alert">⚠️ {err}</div>
          ))}
        </div>
      )}

      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-value">{stats. total}</p>
        </div>
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">${stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Average</h3>
          <p className="stat-value">${stats.average.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Types</h3>
          <p className="stat-value">{Object.keys(stats.byType).length}</p>
        </div>
      </section>

      <div className="tabs">
        <button className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
          💳 Transactions
        </button>
        <button className={`tab-button ${activeTab === 'excel' ? 'active' :  ''}`} onClick={() => setActiveTab('excel')}>
          📊 Import/Export
        </button>
      </div>

      {activeTab === 'transactions' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Transactions</h2>
            <button className="add-button" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Close' : '+ New'}
            </button>
          </div>

          {showForm && <TransactionForm onSubmit={(data) => { onAddTransaction(data); setShowForm(false); }} isLoading={isLoading} />}

          <div className="filters">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" />
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="filter-select">
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
            </select>
          </div>

          <TransactionList transactions={filteredTransactions} onDelete={onDeleteTransaction} isLoading={isLoading} />
        </div>
      )}

      {activeTab === 'excel' && <ExcelManager transactions={transactions} userId={user.id} onImportSuccess={onImportTransactions} isLoading={isLoading} />}
    </div>
  )
}
