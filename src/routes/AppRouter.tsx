import { BrowserRouter, Routes, Route } from 'react-router'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Agregaremos rutas reales más adelante */}
                <Route path="/" element={<div>Página de inicio</div>} />
                <Route path="/predict" element={<div>Página de predicción</div>} />
            </Routes>
        </BrowserRouter>
    )
}
