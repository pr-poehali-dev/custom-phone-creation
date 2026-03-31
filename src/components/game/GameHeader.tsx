import { GameState } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface GameHeaderProps {
  state: GameState;
  onAdminClick: () => void;
}

export default function GameHeader({ state, onAdminClick }: GameHeaderProps) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(var(--neon)), hsl(var(--primary)))', boxShadow: '0 0 15px hsl(var(--neon) / 0.4)' }}>
            <Icon name="Smartphone" size={16} className="text-background" />
          </div>
          <div>
            <div className="font-rajdhani font-bold text-lg leading-none">PhoneCraft</div>
            <div className="text-[10px] text-muted-foreground font-mono">Создай свой телефон</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Icon name="DollarSign" size={14} className="text-yellow-400" />
            <span className="font-mono text-sm font-bold text-yellow-400">{(state.money / 1000000).toFixed(1)}М</span>
          </div>

          <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Icon name="FlaskConical" size={14} className="text-primary" />
            <span className="font-mono text-sm font-bold neon-text">{state.researchPoints.toLocaleString()} ОИ</span>
          </div>

          <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Icon name="Package" size={14} className="text-muted-foreground" />
            <span className="font-mono text-sm text-foreground">{state.phonesReleased} шт.</span>
          </div>

          <button
            onClick={onAdminClick}
            className="glass rounded-lg px-2 py-1.5 text-muted-foreground hover:text-red-400 transition-colors border border-border hover:border-red-500/30"
            title="Панель администратора"
          >
            <Icon name="ShieldAlert" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
