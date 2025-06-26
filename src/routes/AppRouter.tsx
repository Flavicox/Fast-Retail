// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from '../pages/Home'
import Predict from "../pages/Predict.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/predict" element={<Predict/> } />
            </Routes>
        </BrowserRouter>
    )
}
