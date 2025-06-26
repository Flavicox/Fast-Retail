// src/features/prediction/PredictionTable.tsx
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type {PredictionRecord} from "../../pages/Predict.tsx";
import toast from 'react-hot-toast'

interface Props {
    data: PredictionRecord[]
}

export default function PredictionTable({ data }: Props) {
    const exportToPDF = () => {
        if (data.length === 0) {
            toast.error('No hay datos para exportar')
            return
        }

        const doc = new jsPDF()
        autoTable(doc, {
            head: [
                [
                    'Producto',
                    'Precio (S/)',
                    'Descuento (%)',
                    'Envío (S/)',
                    'Categoría',
                    'Método de Pago',
                    'Canal',
                    'Fecha',
                    'Predicción'
                ]
            ],
            body: data.map((row) => [
                row.productName,
                row.unitPrice.toFixed(2),
                row.discount.toFixed(2),
                row.shippingCost.toFixed(2),
                row.category,
                row.paymentMethod,
                row.salesChannel,
                new Date(row.invoiceDate).toLocaleString(),
                row.predictedQuantity
            ])
        })

        doc.save('predicciones_fastretail.pdf')
        toast.success('PDF exportado correctamente')
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Historial de Predicciones</h2>
                <button
                    onClick={exportToPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Exportar a PDF
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full text-sm bg-white">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3 text-left">Producto</th>
                        <th className="p-3 text-left">Precio (S/)</th>
                        <th className="p-3 text-left">Descuento (%)</th>
                        <th className="p-3 text-left">Envío (S/)</th>
                        <th className="p-3 text-left">Categoría</th>
                        <th className="p-3 text-left">Pago</th>
                        <th className="p-3 text-left">Canal</th>
                        <th className="p-3 text-left">Fecha</th>
                        <th className="p-3 text-left">Predicción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="p-3">{row.productName}</td>
                            <td className="p-3">{row.unitPrice.toFixed(2)}</td>
                            <td className="p-3">{row.discount.toFixed(2)}</td>
                            <td className="p-3">{row.shippingCost.toFixed(2)}</td>
                            <td className="p-3">{row.category}</td>
                            <td className="p-3">{row.paymentMethod}</td>
                            <td className="p-3">{row.salesChannel}</td>
                            <td className="p-3">{new Date(row.invoiceDate).toLocaleString()}</td>
                            <td className="p-3 font-semibold text-blue-700">
                                {row.predictedQuantity}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
