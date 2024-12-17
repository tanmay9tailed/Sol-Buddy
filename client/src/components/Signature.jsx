import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Signature = () => {
  const { signature } = useParams()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/transactions/getTransaction/${signature}`)
        setTransaction(response.data.data)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setError('Failed to fetch transaction details')
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [signature])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-emerald-900">
        <div className="p-4 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
          Loading transaction details...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-emerald-900">
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-emerald-50 dark:bg-emerald-900 text-emerald-900 dark:text-lime-300">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-500 to-lime-500 text-transparent bg-clip-text">
          Transaction Details
        </h1>
        
        <div className="space-y-6">
          <div className="p-6 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Transaction Signature</h2>
            <p className="font-mono break-all">{signature}</p>
          </div>

          {transaction && (
            <>
              <div className="p-6 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4">Addresses</h2>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">From: </span>
                    <span className="font-mono break-all">{transaction.from}</span>
                  </div>
                  <div>
                    <span className="font-medium">To: </span>
                    <span className="font-mono break-all">{transaction.to}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/30 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4">Balance Changes</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Pre-Transaction</h3>
                    <div className="font-mono">
                      {transaction.preBalances.map((balance, index) => (
                        <div key={index}>{balance / 1000000000} SOL</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Post-Transaction</h3>
                    <div className="font-mono">
                      {transaction.postBalances.map((balance, index) => (
                        <div key={index}>{balance / 1000000000} SOL</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signature