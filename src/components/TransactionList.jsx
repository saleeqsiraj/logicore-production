import React from 'react'
import '../styles/TransactionList.css'

export default function TransactionList({ transactions, onDelete, isLoading }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions found</p>
        <small>Create or import transactions to get started</small>
      </div>
    )
  }

  return (
    <div className="transaction-list">
      {transactions.map(t => (
        <div key={t.id} className="transaction-card">
          <div className="card-header">
            <h3>{t.type. toUpperCase()}</h3>
            <span className="amount">${parseFloat(t.amount).toFixed(2)}</span>
          </div>
          <div className="card-body">
            <p><strong>{t.accountNumber}</strong></p>
            <p className="description">{t.description || '(no description)'}</p>
            <small>{new Date(t.createdAt).toLocaleString()}</small>
          </div>
          <button onClick={() => onDelete(t.id)} disabled={isLoading} className="delete-button">
            🗑️ Delete
          </button>
        </div>
      ))}
    </div>
  )
}
