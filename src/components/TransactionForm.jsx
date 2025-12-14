import React, { useState } from 'react'
import '../styles/TransactionForm.css'

export default function TransactionForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({ accountNumber: '', amount: '', type: 'deposit', description: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.accountNumber) newErrors.accountNumber = 'Required'
    if (!formData. amount) newErrors.amount = 'Required'
    if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Must be positive'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(formData)
    setFormData({ accountNumber: '', amount: '', type: 'deposit', description: '' })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Account Number *</label>
          <input type="text" value={formData. accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} placeholder="ACC001" disabled={isLoading} className={errors.accountNumber ? 'error' : ''} />
          {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
        </div>

        <div className="form-group">
          <label>Amount *</label>
          <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" disabled={isLoading} className={errors.amount ? 'error' : ''} />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Type *</label>
          <select value={formData. type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={isLoading}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
            <option value="payment">Payment</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.description} onChange={e => setFormData({... formData, description: e.target.value})} placeholder="Optional notes" rows="2" disabled={isLoading} />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Creating.. .' : '✓ Create Transaction'}
      </button>
    </form>
  )
}
