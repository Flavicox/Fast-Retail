// src/features/prediction/PredictionForm.tsx
import { useForm } from 'react-hook-form'
import {type PredictionFormData, predictionFormSchema} from "../../lib/zodSchemas.ts";
import type {PredictionRecord} from "../../pages/Predict.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {usePredictMutation} from "../../services/predictionApi.ts";
import toast from 'react-hot-toast'
import {useEffect} from "react";

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
        register, handleSubmit, reset, watch, setValue,
        formState: { errors },
    } = useForm<PredictionFormData>({
        resolver: zodResolver(predictionFormSchema),
    });

    const salesChannelValue = watch('salesChannel');

    useEffect(() => {
        if (salesChannelValue === 'In-store') {
            setValue('shippingCost', 0); // fuerza 0
        }
    }, [salesChannelValue, setValue]);

    const [predict, { isLoading }] = usePredictMutation()

    const onSubmit = async (data: PredictionFormData) => {
        const payload = {
            UnitPrice:   data.unitPrice,
            Discount:    data.discount / 100,
            ShippingCost:
                data.salesChannel === 'In-store' ? 0 : data.shippingCost, // 👈 fuerza 0
            Category:     data.category,
            PaymentMethod:data.paymentMethod,
            SalesChannel: data.salesChannel,
            InvoiceDate:  data.invoiceDate,
        };

        try {
            const response = await predict(payload).unwrap();
            onPredict({ ...data, shippingCost: payload.ShippingCost, predictedQuantity: response.predicted_quantity });
            toast.success('Predicción generada correctamente');
            reset();
        } catch {
            toast.error('Error al predecir. Inténtalo nuevamente.');
        }
    };


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mb-10"
        >
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Nombre del producto*</label>
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
                    <label className="block font-medium">Precio unitario (S/)*</label>
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
                    <input
                        type="number"
                        step="0.01"
                        {...register('shippingCost')}
                        className={`input ${salesChannelValue === 'In-store' ? 'bg-gray-100 shadow-inner cursor-not-allowed' : ''}`}
                        disabled={salesChannelValue === 'In-store'}
                    />
                    {errors.shippingCost ? (
                        <p className="text-red-500 text-sm">{errors.shippingCost.message}</p>
                    ) : salesChannelValue === 'In-store' ? (
                        <p className="text-gray-500 text-sm">Para ventas en tienda, no se considera costo de envío.</p>
                    ) : null}

                </div>

                <div>
                    <label className="block font-medium">Categoría*</label>
                    <select {...register('category')} className="input">
                        <option value="">Seleccione una categoría</option>
                        <option value="Electronics">Electrónica</option>
                        <option value="Accesories">Accesorios</option>
                        <option value="Apparel">Vestimenta</option>
                        <option value="Stationery">Papelería</option>
                        <option value="Furniture">Mueblería</option>
                    </select>
                    {errors.category && (
                        <span className="text-red-500 text-sm">{errors.category.message}</span>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Método de pago*</label>
                    <select {...register('paymentMethod')} className="input">
                        <option value="">Seleccione uno</option>
                        <option value="Desconocido">Desconocido</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Transferencia bancaria</option>
                        <option value="Credit Card">Tarjeta de crédito</option>
                    </select>
                    {errors.paymentMethod && (
                        <span className="text-red-500 text-sm">{errors.paymentMethod.message}</span>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Canal de venta*</label>
                    <select {...register('salesChannel')} className="input">
                        <option value="In-store">En tienda</option>
                        <option value="Online">Online</option>
                    </select>
                    {errors.salesChannel && (
                        <span className="text-red-500 text-sm">{errors.salesChannel.message}</span>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Fecha de venta*</label>
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
            <p className="text-gray-500 text-sm mt-2">Los campos con * son obligatorios</p>

            <button
                type="submit"
                disabled={isLoading}
                className={`mt-4 w-full py-2 rounded-lg transition text-white 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? 'Prediciendo...' : 'Predecir'}
            </button>
        </form>
    )
}
