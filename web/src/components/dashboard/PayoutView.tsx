import { useForm } from '@tanstack/react-form'
import { updatePayoutSettingsServerFn } from '../../lib/payout-utils'
import { Wallet, ShieldCheck, Info } from 'lucide-react'
import { useState } from 'react'

interface PayoutViewProps {
  initialAddress: string
}

export const PayoutView = ({ initialAddress }: PayoutViewProps) => {
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      payoutAddress: initialAddress || '',
    },
    onSubmit: async ({ value }) => {
      try {
        await (updatePayoutSettingsServerFn as any)({ data: value })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        console.error('Update failed:', err)
      }
    },
  })

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Wallet_<span className="text-neon-cyan">Settings</span></h2>
        <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
          Masukkan alamat wallet tujuan untuk menerima donasi secara langsung (P2P).
        </p>
      </div>

      <div className="p-8 bg-white/[0.02] border border-white/5 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Wallet size={80} />
        </div>

        <div className="flex items-start gap-4 p-4 bg-neon-cyan/5 border border-neon-cyan/20">
          <Info size={18} className="text-neon-cyan shrink-0 mt-0.5" />
          <p className="text-[10px] text-neutral-400 leading-relaxed uppercase font-bold tracking-widest">
            Donasi akan dikirim secara langsung dari pengirim ke dompet Anda. Sistem Tipfy hanya berfungsi sebagai pendeteksi transaksi on-chain untuk mengaktifkan alert dan statistik.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-neon-cyan" /> Receiver Wallet Address
            </label>
            
            <form.Field
              name="payoutAddress"
              children={(field) => (
                <>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full bg-black border ${field.state.meta.errors.length ? 'border-neon-pink' : 'border-white/10'} p-4 font-mono text-xs text-white focus:border-neon-cyan focus:outline-none transition-colors skew-x--5]`}
                    placeholder="0x..."
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[8px] font-bold text-neon-pink uppercase mt-2 tracking-widest">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="w-full py-4 bg-neon-cyan text-black font-black uppercase tracking-[0.3em] italic skew-x--10 hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="skew-x-10">
              {form.state.isSubmitting ? 'Processing...' : 'Simpan Alamat Receiver'}
            </span>
          </button>

          {success && (
            <p className="text-center text-[10px] font-black text-green-500 uppercase animate-pulse">
              Protocol Updated. Dompet tujuan berhasil dikonfigurasi!
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
