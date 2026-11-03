import { Routes, Route, Navigate } from "react-router-dom";
import BookingPage from "./pages/BookingPage";

function LoginPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Login administrativo em construção
      </h1>
    </main>
  );
}

function AdminPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Painel administrativo em construção
      </h1>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
