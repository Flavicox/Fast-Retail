import { useState, useEffect } from 'react'
import PredictionForm from "../features/prediction/PredictionForm.tsx"
import PredictionResult from "../features/prediction/PredictionResult.tsx"
import PredictionTable from "../features/prediction/PredictionTable.tsx"

export interface PredictionRecord {
    productName: string
    unitPrice: number
    discount: number
    shippingCost: number
    category: string
    paymentMethod: string
    salesChannel: string
    invoiceDate: string
    predictedQuantity: number
}

export default function Predict() {
    const [records, setRecords] = useState<PredictionRecord[]>([])
    const [latestPrediction, setLatestPrediction] = useState<number | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('predictionRecords')
        if (saved) {
            setRecords(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('predictionRecords', JSON.stringify(records))
    }, [records])

    const handlePrediction = (newRecord: PredictionRecord) => {
        setRecords((prev) => [...prev, newRecord])
        setLatestPrediction(newRecord.predictedQuantity)
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">
                Predicción de Demanda
            </h1>

            <PredictionForm onPredict={handlePrediction} />

            {latestPrediction !== null && (
                <PredictionResult value={latestPrediction} />
            )}

            {records.length > 0 && <PredictionTable data={records} />}
        </div>
    )
}
