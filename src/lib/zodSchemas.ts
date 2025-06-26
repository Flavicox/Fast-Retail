// src/lib/zodSchemas.ts
import { z } from 'zod'

export const predictionFormSchema = z.object({
    productName: z.string().min(1, 'El nombre es requerido'),
    unitPrice: z.coerce.number().positive('Debe ser mayor a 0'),
    discount: z.coerce.number().min(0).max(100, 'Máximo 100%'),
    shippingCost: z.coerce.number().min(0, 'Debe ser 0 o mayor'),
    category: z.enum(['Desconocido', 'Electronics', 'Accesories', 'Apparel', 'Stationery']),
    paymentMethod: z.enum(['Desconocido', 'PayPal', 'Bank Transfer', 'Credit Card']),
    salesChannel: z.enum(['In-store', 'Online']),
    invoiceDate: z.string().min(1, 'La fecha es requerida'),
})

export type PredictionFormData = z.infer<typeof predictionFormSchema>
