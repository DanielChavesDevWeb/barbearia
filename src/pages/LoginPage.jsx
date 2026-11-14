
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      return;
    }

    navigate("/admin");
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1c1c1c] border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Área administrativa
          </h1>

          <p className="text-gray-400 mt-2">
            Entre com suas credenciais para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Senha
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-orange-400 transition"
          >
            Voltar para os agendamentos
          </Link>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
