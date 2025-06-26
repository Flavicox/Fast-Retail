interface Props {
    value: number
}

export default function PredictionResult({ value }: Props) {
    return (
        <div className="max-w-xl mx-auto mb-10">
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-semibold mb-2">Resultado de la Predicción</h2>
                <p className="text-5xl font-bold">{value}</p>
                <p className="mt-1 text-sm text-gray-700">Unidades esperadas a vender</p>
            </div>
        </div>
    )
}
