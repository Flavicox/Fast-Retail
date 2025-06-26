import { Link } from "react-router";

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Imagen de fondo */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://gpdgroup.com/wp-content/uploads/2022/11/RaceTrac_resized-3.png')",
                }}
            ></div>

            {/* Capa oscura semitransparente */}
            <div className="absolute inset-0 bg-gray-800/90"></div>

            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                    FastRetail
                </h1>
                <p className="text-white text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
                    Predice la demanda de tus productos con inteligencia artificial.
                    Ingresa datos clave como precio, categoría y canal de venta,
                    y obtén una estimación inmediata de cuántas unidades venderás.
                </p>
                <Link
                    to="/predict"
                    className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Empezar ahora
                </Link>

                <footer className="mt-12 text-sm text-gray-300">
                    © 2025 FastRetail · Predicción rápida y confiable
                </footer>
            </div>
        </div>
    )
}
