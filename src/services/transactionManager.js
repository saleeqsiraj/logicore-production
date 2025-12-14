class TransactionManager {
  constructor() {
    this.transactions = []
    this.loadFromLocalStorage()
  }

  createTransaction(data) {
    if (!data.accountNumber || !data.amount || !data.type) {
      throw new Error('Missing required fields')
    }

    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date().toISOString()
    }

    this.transactions.unshift(transaction)
    this.saveToLocalStorage()
    return transaction
  }

  getTransactions() {
    return this.transactions
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id)
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('logicore_transactions', JSON.stringify(this. transactions))
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('logicore_transactions')
      if (saved) this.transactions = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load:', error)
    }
  }
}

export const transactionManager = new TransactionManager()
