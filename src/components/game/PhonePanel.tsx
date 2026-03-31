import { PhoneConfig } from '@/store/gameStore';
import PhonePreview from '@/components/PhonePreview';
import Icon from '@/components/ui/icon';

interface PhonePanelProps {
  phone: PhoneConfig;
  onPhoneUpdate: (updates: Partial<PhoneConfig>) => void;
  onRelease: () => void;
}

export default function PhonePanel({ phone, onPhoneUpdate, onRelease }: PhonePanelProps) {
  return (
    <div className="glass rounded-2xl p-5 border border-border sticky top-24">
      <div className="font-rajdhani font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <Icon name="Eye" size={14} />
        Предпросмотр
      </div>

      <PhonePreview phone={phone} />

      <div className="mt-4 space-y-2">
        <input
          type="text"
          value={phone.brand}
          onChange={e => onPhoneUpdate({ brand: e.target.value })}
          placeholder="Бренд"
          className="w-full bg-muted rounded-lg px-3 py-2 text-sm border border-border focus:border-primary/50 outline-none font-mono"
        />
        <input
          type="text"
          value={phone.name}
          onChange={e => onPhoneUpdate({ name: e.target.value })}
          placeholder="Название модели"
          className="w-full bg-muted rounded-lg px-3 py-2 text-sm border border-border focus:border-primary/50 outline-none font-mono"
        />
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Цена ($)</span>
          <span className="gold-text font-mono font-bold">${phone.price}</span>
        </div>
        <input
          type="range" min={99} max={3999} step={50}
          value={phone.price}
          onChange={e => onPhoneUpdate({ price: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>$99</span><span>$3999</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Батарея</span>
          <span className="text-foreground font-mono">{phone.battery} мАч</span>
        </div>
        <input
          type="range" min={1000} max={10000} step={100}
          value={phone.battery}
          onChange={e => onPhoneUpdate({ battery: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <button
        onClick={onRelease}
        className="mt-4 w-full py-3 rounded-xl font-rajdhani font-bold text-base transition-all"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--neon) / 0.9), hsl(195 100% 35%))',
          boxShadow: '0 0 25px hsl(var(--neon) / 0.3)',
          color: '#050510',
        }}>
        🚀 ВЫПУСТИТЬ НА РЫНОК
      </button>
    </div>
  );
}
