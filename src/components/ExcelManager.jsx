import React, { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import readXlsxFile from 'read-excel-file'
import { transactionManager } from '../services/transactionManager'
import '../styles/ExcelManager.css'

export default function ExcelManager({ transactions, userId, onImportSuccess, isLoading }) {
  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState(null)
  const [importErrors, setImportErrors] = useState([])

  const downloadTemplate = () => {
    const templateData = [
      { Type: 'deposit', Amount: 1000, 'Account Number': 'ACC001', Description: 'Example' },
      { Type: 'withdrawal', Amount: 500, 'Account Number': 'ACC002', Description: 'Example' }
    ]
    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
    XLSX.writeFile(wb, 'transaction-template.xlsx')
  }

  const exportTransactions = () => {
    if (transactions.length === 0) {
      alert('No transactions to export')
      return
    }
    const data = transactions.map(t => ({
      Type: t.type,
      Amount: t.amount,
      'Account Number': t.accountNumber,
      Description: t.description,
      Created: new Date(t.createdAt).toLocaleString()
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
    const filename = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, filename)
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files? .[0]
    if (!file) return

    try {
      const rows = await readXlsxFile(file)
      if (! rows || rows.length < 2) {
        setImportStatus({ success: false, message: 'File is empty' })
        return
      }

      const imported = []
      const errors = []

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        try {
          const transaction = transactionManager.createTransaction({
            userId,
            accountNumber: String(row[2] || '').trim(),
            amount: parseFloat(row[1]),
            type: String(row[0] || '').toLowerCase().trim(),
            description: String(row[3] || '').trim()
          })
          imported.push(transaction)
        } catch (error) {
          errors.push({ row:  i + 1, error: error.message })
        }
      }

      setImportStatus({
        success: true,
        message: `Imported ${imported.length} transactions${errors.length > 0 ? ` (${errors.length} errors)` : ''}`
      })
      setImportErrors(errors)
      onImportSuccess(imported)
    } catch (error) {
      setImportStatus({ success: false, message: error. message })
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="excel-manager">
      <div className="excel-section">
        <h3>📥 Import from Excel</h3>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} style={{ display: 'none' }} />
        <button onClick={() => fileInputRef.current?. click()} disabled={isLoading} className="action-button">
          📤 Choose File
        </button>
        <button onClick={downloadTemplate} className="action-button secondary">
          📋 Download Template
        </button>
        {importStatus && <div className={`status ${importStatus.success ? 'success' : 'error'}`}>{importStatus.success ? '✅' : '❌'} {importStatus.message}</div>}
        {importErrors.length > 0 && (
          <div className="errors">
            {importErrors.slice(0, 5).map((err, i) => (
              <p key={i}>Row {err.row}: {err. error}</p>
            ))}
          </div>
        )}
      </div>

      <div className="excel-section">
        <h3>📤 Export to Excel</h3>
        <p>Total:  <strong>{transactions.length}</strong> transactions</p>
        <button onClick={exportTransactions} disabled={transactions.length === 0 || isLoading} className="action-button">
          📥 Export All
        </button>
      </div>
    </div>
  )
}
