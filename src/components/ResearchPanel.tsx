import { GameState, TECH_TREE } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface ResearchPanelProps {
  state: GameState;
  onUnlock: (techId: string, cost: number) => void;
}

export default function ResearchPanel({ state, onUnlock }: ResearchPanelProps) {
  const progressPct = Math.min(100, (state.researchPoints / state.totalResearchMax) * 100);

  return (
    <div className="space-y-4">
      {/* Research points bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="FlaskConical" size={16} className="text-primary" />
            <span className="font-rajdhani font-bold text-sm">ОЧКИ ИССЛЕДОВАНИЯ</span>
          </div>
          <span className="font-mono text-xs neon-text">{state.researchPoints.toLocaleString()} / {state.totalResearchMax.toLocaleString()}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, hsl(var(--neon)), hsl(var(--primary)))',
              boxShadow: '0 0 10px hsl(var(--neon) / 0.5)',
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Начало</span>
          <span className="neon-text">{progressPct.toFixed(1)}%</span>
          <span>APEX</span>
        </div>
      </div>

      {/* Tech tree */}
      <div className="space-y-2">
        <div className="font-rajdhani text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Дерево технологий
        </div>
        {TECH_TREE.map((tech) => {
          const isUnlocked = state.unlockedTech.includes(tech.id);
          const canAfford = state.researchPoints >= tech.cost;

          return (
            <div
              key={tech.id}
              className={`glass rounded-xl p-3 border transition-all duration-200 ${
                isUnlocked
                  ? 'border-green-500/30 bg-green-500/5'
                  : canAfford
                    ? 'glass-hover cursor-pointer border-primary/20'
                    : 'opacity-50 border-border'
              }`}
              onClick={() => !isUnlocked && canAfford && onUnlock(tech.id, tech.cost)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-400' : canAfford ? 'bg-primary animate-pulse-slow' : 'bg-muted-foreground'}`} />
                  <div>
                    <div className="text-sm font-semibold">{tech.name}</div>
                    <div className="text-[10px] text-muted-foreground">{tech.unlocks}</div>
                  </div>
                </div>
                <div className="text-right">
                  {isUnlocked ? (
                    <div className="text-green-400 text-xs font-mono">✓ Открыто</div>
                  ) : (
                    <div className={`text-xs font-mono ${canAfford ? 'neon-text' : 'text-muted-foreground'}`}>
                      {tech.cost.toLocaleString()} ОИ
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground">с {tech.era} года</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Earn research points tip */}
      <div className="glass rounded-xl p-3 border border-gold/20">
        <div className="flex items-start gap-2">
          <Icon name="Lightbulb" size={14} className="text-yellow-400 mt-0.5 shrink-0" />
          <div className="text-[11px] text-muted-foreground">
            Выпускайте телефоны на рынок и получайте очки исследования за каждую продажу. Больше оценка — больше очков.
          </div>
        </div>
      </div>
    </div>
  );
}
