import { GameState, ERAS } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface SidePanelProps {
  state: GameState;
  onEraChange: (era: typeof ERAS[number]['id']) => void;
}

export default function SidePanel({ state, onEraChange }: SidePanelProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="glass rounded-2xl p-4 border border-border">
        <div className="font-rajdhani font-bold text-sm text-muted-foreground uppercase mb-3 flex items-center gap-2">
          <Icon name="Clock" size={14} />
          Эпоха разработки
        </div>
        <div className="space-y-2">
          {ERAS.map(era => {
            const isActive = era.id === state.era;
            return (
              <button
                key={era.id}
                onClick={() => onEraChange(era.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                  isActive ? 'selected-card bg-primary/5' : 'glass-hover border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-sm" style={{ color: isActive ? 'hsl(var(--neon))' : undefined }}>
                    {era.label}
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{era.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {state.ratings.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-border">
          <div className="font-rajdhani font-bold text-sm text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <Icon name="History" size={14} />
            История выпусков
          </div>
          <div className="space-y-2">
            {[...state.ratings].reverse().map((r, i) => (
              <div key={i} className="glass rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">${r.price}</div>
                </div>
                <div className={`font-rajdhani font-bold text-base ${r.score >= 8 ? 'text-green-400' : r.score >= 6 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {r.score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-4 border border-border">
        <div className="font-rajdhani font-bold text-sm text-muted-foreground uppercase mb-3 flex items-center gap-2">
          <Icon name="Lightbulb" size={14} />
          Подсказки
        </div>
        <div className="space-y-2 text-[11px] text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="neon-text shrink-0">▸</span>
            Начни с простого телефона, заработай деньги и очки исследования
          </div>
          <div className="flex items-start gap-2">
            <span className="neon-text shrink-0">▸</span>
            Не завышай цену — покупатели ставят низкую оценку
          </div>
          <div className="flex items-start gap-2">
            <span className="neon-text shrink-0">▸</span>
            Открывай технологии через вкладку "Наука" для топ-чипов и ОС
          </div>
          <div className="flex items-start gap-2">
            <span className="gold-text shrink-0">▸</span>
            Цель: APEX чип 280 000 МГц — легендарный телефон!
          </div>
        </div>
      </div>
    </div>
  );
}
