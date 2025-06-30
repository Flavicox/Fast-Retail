// src/features/prediction/PredictionForm.tsx
import { useForm } from 'react-hook-form'
import {type PredictionFormData, predictionFormSchema} from "../../lib/zodSchemas.ts";
import type {PredictionRecord} from "../../pages/Predict.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {usePredictMutation} from "../../services/predictionApi.ts";
import toast from 'react-hot-toast'

interface Props {
    onPredict: (data: PredictionRecord) => void
}

function getNowLocalISOString(): string {
    const now = new Date()
    now.setSeconds(0, 0)
    const offset = now.getTimezoneOffset()
    const local = new Date(now.getTime() - offset * 60 * 1000)
    return local.toISOString().slice(0, 16)
}

export default function PredictionForm({ onPredict }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PredictionFormData>({
        resolver: zodResolver(predictionFormSchema),
    })

    const [predict, { isLoading }] = usePredictMutation()

    const onSubmit = async (data: PredictionFormData) => {
        try {
            const response = await predict({
                UnitPrice: data.unitPrice,
                Discount: data.discount / 100,
                ShippingCost: data.shippingCost,
                Category: data.category,
                PaymentMethod: data.paymentMethod,
                SalesChannel: data.salesChannel,
                InvoiceDate: data.invoiceDate,
            }).unwrap()

            const newRecord: PredictionRecord = {
                ...data,
                predictedQuantity: response.predicted_quantity,
            }

            onPredict(newRecord)
            toast.success('Predicción generada correctamente')
            reset()
        } catch (error) {
            toast.error('Error al predecir. Inténtalo nuevamente.')
        }
    }


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mb-10"
        >
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Nombre del producto</label>
                    <input
                        type="text"
                        {...register('productName')}
                        className="input"
                    />
                    {errors.productName && (
                        <p className="text-red-500 text-sm">{errors.productName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Precio unitario (S/)</label>
                    <input type="number" step="0.01" {...register('unitPrice')} className="input" />
                    {errors.unitPrice && (
                        <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Descuento (%)</label>
                    <input type="number" step="0.01" {...register('discount')} className="input" />
                    {errors.discount && (
                        <p className="text-red-500 text-sm">{errors.discount.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Costo de envío (S/)</label>
                    <input type="number" step="0.01" {...register('shippingCost')} className="input" />
                    {errors.shippingCost && (
                        <p className="text-red-500 text-sm">{errors.shippingCost.message}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Categoría</label>
                    <select {...register('category')} className="input">
                        <option value="Electronics">Electrónica</option>
                        <option value="Accesories">Accesorios</option>
                        <option value="Apparel">Vestimenta</option>
                        <option value="Stationery">Papelería</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Método de pago</label>
                    <select {...register('paymentMethod')} className="input">
                        <option value="Desconocido">Desconocido</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Transferencia bancaria</option>
                        <option value="Credit Card">Tarjeta de crédito</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Canal de venta</label>
                    <select {...register('salesChannel')} className="input">
                        <option value="In-store">En tienda</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Fecha de venta</label>
                    <input
                        type="datetime-local"
                        {...register('invoiceDate')}
                        className="input"
                        max={getNowLocalISOString()}
                        step="60" // permite solo minutos completos
                    />
                    {errors.invoiceDate && (
                        <p className="text-red-500 text-sm">{errors.invoiceDate.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`mt-6 w-full py-2 rounded-lg transition text-white 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? 'Prediciendo...' : 'Predecir'}
            </button>
        </form>
    )
}
