import { CHIPS, ChipConfig, GameState } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface ChipLabProps {
  state: GameState;
  selected: ChipConfig;
  onSelect: (chip: ChipConfig) => void;
}

export default function ChipLab({ state, selected, onSelect }: ChipLabProps) {
  const isApexUnlocked = state.unlockedTech.includes('apex_chip');
  const isCustomChipUnlocked = state.unlockedTech.includes('custom_chip');

  const availableChips = CHIPS.filter(c => {
    if (c.name === 'APEX UltraChip') return isApexUnlocked;
    if (c.name === 'DragonFire 8 Elite') return isCustomChipUnlocked;
    return true;
  });

  const getFreqLabel = (freq: number) => {
    if (freq >= 1000) return `${(freq / 1000).toFixed(1)} ГГц`;
    return `${freq} МГц`;
  };

  const getPowerColor = (score: number) => {
    if (score >= 100000) return '#ff6b35';
    if (score >= 10000) return '#7c3aed';
    if (score >= 1000) return '#00f5ff';
    return '#22c55e';
  };

  return (
    <div className="space-y-3">
      {/* Selected chip display */}
      <div className="glass rounded-xl p-4 border neon-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center chip-glow"
            style={{ background: `linear-gradient(135deg, ${getPowerColor(selected.score)}30, transparent)`, border: `1px solid ${getPowerColor(selected.score)}50` }}>
            <Icon name="Cpu" size={22} style={{ color: getPowerColor(selected.score) }} />
          </div>
          <div>
            <div className="font-rajdhani font-bold text-base">{selected.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono">{selected.process}нм · {selected.cores}-ядерный</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-muted-foreground text-[10px]">Частота</div>
            <div className="font-mono font-bold neon-text">{getFreqLabel(selected.maxFreq)}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-muted-foreground text-[10px]">Разгон</div>
            <div className="font-mono font-bold text-yellow-400">+{selected.overclock}%</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-muted-foreground text-[10px]">Рейтинг</div>
            <div className="font-mono font-bold" style={{ color: getPowerColor(selected.score) }}>
              {selected.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Power bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Мощность чипа</span>
            <span>{((selected.score / 280000) * 100).toFixed(2)}% от MAX</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (selected.score / 280000) * 100)}%`,
                background: `linear-gradient(90deg, ${getPowerColor(selected.score)}, ${getPowerColor(selected.score)}80)`,
                boxShadow: `0 0 8px ${getPowerColor(selected.score)}60`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Chip list */}
      <div className="space-y-2">
        {availableChips.map((chip) => {
          const isSelected = chip.name === selected.name;
          const color = getPowerColor(chip.score);

          return (
            <div
              key={chip.name}
              onClick={() => onSelect(chip)}
              className={`rounded-xl p-3 border cursor-pointer transition-all duration-200 ${
                isSelected ? 'selected-card bg-primary/5' : 'glass glass-hover border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon name="Cpu" size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{chip.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {chip.cores} ядер · {chip.process}нм · +{chip.overclock}% разгон
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold" style={{ color }}>{getFreqLabel(chip.maxFreq)}</div>
                  <div className="text-[10px] text-muted-foreground">{chip.score.toLocaleString()} pts</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isCustomChipUnlocked && (
        <div className="glass rounded-xl p-3 border border-yellow-500/20 text-center">
          <div className="text-yellow-400 text-xs font-mono">🔒 DragonFire + APEX — откройте через исследования</div>
        </div>
      )}
    </div>
  );
}
