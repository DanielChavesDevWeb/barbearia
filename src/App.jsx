
import { useState } from 'react'

const services = [
  { id: 'barba', name: 'Barba', description: 'Acabamento e alinhamento', price: 20 },
  { id: 'tesoura', name: 'Corte tesoura', description: 'Corte clássico personalizado', price: 30 },
  { id: 'degrade', name: 'Degradê navalha ou zero', description: 'Degradê com acabamento preciso', price: 40 },
  { id: 'combo', name: 'Combo corte, barba e sobrancelha', description: 'Visual completo', price: 55 },
]

const formatPrice = (price) =>
  price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

function getDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createSlots() {
  const slots = []

  for (let hour = 9; hour < 12; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`)
    slots.push(`${String(hour).padStart(2, '0')}:30`)
  }

  for (let hour = 14; hour < 21; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`)
    if (hour < 20 || hour === 20) {
      slots.push(`${String(hour).padStart(2, '0')}:30`)
    }
  }

  return slots
}

function App() {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerName, setCustomerName] = useState('')

  const today = getDateString(new Date())
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)

  const slots = createSlots()

  function isSunday(dateString) {
    if (!dateString) return false
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day).getDay() === 0
  }

  function handleDateChange(event) {
    const date = event.target.value

    if (isSunday(date)) return

    setSelectedDate(date)
    setSelectedTime('')
  }

  const canContinue =
    selectedService &&
    selectedDate &&
    selectedTime &&
    customerName.trim().length >= 2

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xl font-black uppercase tracking-[0.18em]">
              Barbearia<span className="text-orange-500">.</span>
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Seu estilo, no seu horário.
            </p>
          </div>

          <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-300">
            Agendamento online
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Atendimento com hora marcada
          </p>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Seu próximo visual
            <br />
            começa <span className="text-orange-500">aqui.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
            Escolha seu serviço, selecione o melhor horário e deixe o resto
            com a gente.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                  1
                </span>
                <h2 className="text-xl font-bold">Escolha seu serviço</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => {
                  const active = selectedService?.id === service.id

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      aria-pressed={active}
                      className={`rounded-2xl border p-5 text-left transition ${
                        active
                          ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500'
                          : 'border-white/10 bg-[#1b1b1b] hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold leading-5">
                          {service.name}
                        </h3>

                        <span
                          className={`text-lg font-black ${
                            active ? 'text-orange-400' : 'text-white'
                          }`}
                        >
                          {formatPrice(service.price)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-zinc-400">
                        {service.description}
                      </p>

                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-orange-500">
                        {active ? '✓ Selecionado' : 'Selecionar serviço'}
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                  2
                </span>
                <h2 className="text-xl font-bold">Escolha a data</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-5">
                <label
                  htmlFor="booking-date"
                  className="mb-2 block text-sm text-zinc-300"
                >
                  Data do atendimento
                </label>

                <input
                  id="booking-date"
                  type="date"
                  min={today}
                  max={getDateString(maxDate)}
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#111111] p-3 text-white outline-none focus:border-orange-500"
                />

                <p className="mt-3 text-xs text-zinc-500">
                  Atendimento de segunda a sábado. Domingos indisponíveis.
                </p>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                  3
                </span>
                <h2 className="text-xl font-bold">Escolha o horário</h2>
              </div>

              {!selectedDate || isSunday(selectedDate) ? (
                <p className="rounded-xl border border-white/10 p-5 text-sm text-zinc-400">
                  Selecione uma data válida para visualizar os horários.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      aria-pressed={selectedTime === slot}
                      className={`rounded-xl border py-3 text-sm font-semibold transition ${
                        selectedTime === slot
                          ? 'border-orange-500 bg-orange-500 text-black'
                          : 'border-white/10 bg-[#1b1b1b] hover:border-orange-500'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              <p className="mt-3 text-xs text-zinc-500">
                Manhã: 09h–12h · Tarde/noite: 14h–21h · Intervalos de 30 min.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                  4
                </span>
                <h2 className="text-xl font-bold">Seus dados</h2>
              </div>

              <label
                htmlFor="customer-name"
                className="mb-2 block text-sm text-zinc-300"
              >
                Nome completo
              </label>

              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                minLength={2}
                maxLength={100}
                placeholder="Digite seu nome"
                required
                className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] p-4 text-white outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 lg:sticky lg:top-6">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Resumo
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Seu agendamento
            </h2>

            <div className="my-6 space-y-4 border-y border-white/10 py-5 text-sm">
              <div>
                <p className="text-zinc-500">Serviço</p>
                <p className="mt-1 font-semibold">
                  {selectedService?.name ?? 'Nenhum serviço selecionado'}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Data</p>
                <p className="mt-1 font-semibold">
                  {selectedDate
                    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR')
                    : 'Não selecionada'}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Horário</p>
                <p className="mt-1 font-semibold">
                  {selectedTime || 'Não selecionado'}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Cliente</p>
                <p className="mt-1 font-semibold">
                  {customerName.trim() || 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-400">Total</span>
              <span className="text-3xl font-black text-orange-500">
                {formatPrice(selectedService?.price ?? 0)}
              </span>
            </div>

            <button
              type="button"
              disabled={!canContinue}
              className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-4 font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => {
                alert(
                  'Interface pronta! Na próxima etapa vamos salvar este agendamento no Supabase.'
                )
              }}
            >
              Continuar agendamento
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
              A reserva ainda não será gravada no banco nesta etapa.
            </p>
          </aside>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Barbearia. Todos os direitos reservados.
      </footer>
    </main>
  )
}

export default App
