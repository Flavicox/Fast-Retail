// src/lib/zodSchemas.ts
import { z } from 'zod';

export const predictionFormSchema = z.object({
    productName: z.string().min(1, 'El nombre es requerido'),
    unitPrice:  z.coerce.number().positive('Debe ser mayor a 0'),
    discount:   z.coerce.number().min(0).max(100, 'Máximo 100 %'),
    shippingCost: z.coerce.number().min(0, 'Debe ser 0 o mayor'),
    category: z.string()
        .nonempty('Seleccione una categoría')
        .refine(v => ['Furniture','Electronics','Accesories','Apparel','Stationery'].includes(v),
            { message: 'Categoría inválida' }),
    paymentMethod: z.string()
        .nonempty('Seleccione un método de pago')
        .refine(v => ['Desconocido','PayPal','Bank Transfer','Credit Card'].includes(v),
            { message: 'Método de pago inválido' }),
    salesChannel: z.enum(['In-store', 'Online']),
    invoiceDate:  z.string().min(1, 'La fecha es requerida'),
})
    .superRefine((data, ctx) => {
        if (data.salesChannel === 'In-store' && data.shippingCost !== 0) {
            ctx.addIssue({
                path: ['shippingCost'],
                code: z.ZodIssueCode.custom,
                message: 'Las ventas en tienda no tienen costo de envío',
            });
        }
        if (data.salesChannel === 'Online' && data.shippingCost === 0) {
            ctx.addIssue({
                path: ['shippingCost'],
                code: z.ZodIssueCode.custom,
                message: 'Para ventas online ingrese un costo de envío',
            });
        }
    });

export type PredictionFormData = z.infer<typeof predictionFormSchema>;
