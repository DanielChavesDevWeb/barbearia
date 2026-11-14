import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function getTodayLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function AdminPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatPrice = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time) => time?.slice(0, 5) || "-";

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.rpc("admin_get_bookings", {
      p_booking_date: selectedDate || null,
    });

    if (error) {
      setError("Não foi possível carregar os agendamentos.");
      setLoading(false);
      return;
    }

    const orderedBookings = [...(data || [])].sort((a, b) => {
      return a.booking_time.localeCompare(b.booking_time);
    });

    setBookings(orderedBookings);
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const { error } = await supabase.rpc("admin_get_bookings", {
        p_booking_date: selectedDate || null,
      });

      if (error) {
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (active) {
        await loadBookings();
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [navigate, selectedDate, loadBookings]);

  async function handleCancel(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?",
    );

    if (!confirmed) return;

    const { error } = await supabase.rpc("admin_cancel_booking", {
      p_booking_id: id,
    });

    if (error) {
      alert("Não foi possível cancelar o agendamento.");
      return;
    }

    alert("Agendamento cancelado com sucesso!");
    await loadBookings();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  const scheduledBookings = bookings.filter(
    (booking) => booking.status === "scheduled",
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled",
  );

  const expectedRevenue = scheduledBookings.reduce(
    (total, booking) => total + Number(booking.price || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#111111] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Painel administrativo</h1>

            <p className="text-gray-400 mt-2">
              Gerencie os agendamentos da barbearia.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg font-semibold transition"
          >
            Sair
          </button>
        </header>

        {/* RESUMO */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Agendamentos ativos</p>

            <h2 className="text-3xl font-bold mt-2">
              {scheduledBookings.length}
            </h2>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Cancelamentos</p>

            <h2 className="text-3xl font-bold mt-2">
              {cancelledBookings.length}
            </h2>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Faturamento previsto</p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              {formatPrice(expectedRevenue)}
            </h2>
          </div>
        </section>

        {/* LISTAGEM */}

        <section className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Agendamentos</h2>

            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>setSelectedDate(e.target.value || getTodayLocalDate())}
                className="bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-white"
              />

              <button
                onClick={() => setSelectedDate(getTodayLocalDate())}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                Hoje
              </button>

              <button
                onClick={loadBookings}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
              >
                Atualizar
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          {loading ? (
            <p className="text-gray-400 py-8 text-center">
              Carregando agendamentos...
            </p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400 py-8 text-center">
              Nenhum agendamento encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="py-4 pr-4">Cliente</th>
                    <th className="py-4 pr-4">Serviço</th>
                    <th className="py-4 pr-4">Data</th>
                    <th className="py-4 pr-4">Horário</th>
                    <th className="py-4 pr-4">Valor</th>
                    <th className="py-4 pr-4">Origem</th>
                    <th className="py-4 pr-4">Status</th>
                    <th className="py-4">Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5">
                      <td className="py-4 pr-4">
                        <div className="font-medium">
                          {booking.customer_name}
                        </div>

                        <div className="text-gray-500 text-xs">
                          {booking.customer_phone || "Sem telefone"}
                        </div>
                      </td>

                      <td className="py-4 pr-4">{booking.service}</td>

                      <td className="py-4 pr-4">
                        {formatDate(booking.booking_date)}
                      </td>

                      <td className="py-4 pr-4">
                        {formatTime(booking.booking_time)}
                      </td>

                      <td className="py-4 pr-4">
                        {formatPrice(booking.price)}
                      </td>

                      <td className="py-4 pr-4">
                        {booking.source === "presencial"
                          ? "Presencial"
                          : "Online"}
                      </td>

                      <td className="py-4 pr-4">
                        <span
                          className={
                            booking.status === "scheduled"
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {booking.status === "scheduled"
                            ? "Agendado"
                            : "Cancelado"}
                        </span>
                      </td>

                      <td className="py-4">
                        {booking.status === "scheduled" && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
