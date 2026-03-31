import { OS_OPTIONS, OSConfig, GameState } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface OSDesignerProps {
  state: GameState;
  selected: OSConfig;
  onSelect: (os: OSConfig) => void;
}

const ANIMATION_LABELS = ['', 'Минимум', 'Базовые', 'Плавные', 'Динамичные', 'Жидкое стекло'];
const THEME_INFO: Record<string, { label: string; color: string; desc: string }> = {
  default: { label: 'Стандартная', color: '#3b82f6', desc: 'Классический интерфейс' },
  dark: { label: 'Тёмная', color: '#7c3aed', desc: 'Чёрный фон, OLED режим' },
  'liquid-glass': { label: 'Жидкое стекло', color: '#00f5ff', desc: 'Прозрачные, живые элементы' },
};

export default function OSDesigner({ state, selected, onSelect }: OSDesignerProps) {
  const isCustomOSUnlocked = state.unlockedTech.includes('custom_os');
  const isLiquidGlassUnlocked = state.unlockedTech.includes('liquid_glass');

  const availableOS = OS_OPTIONS.filter(os => {
    if (os.type === 'custom') return isCustomOSUnlocked;
    if (os.theme === 'liquid-glass') return isLiquidGlassUnlocked;
    return true;
  });

  const getOSIcon = (type: string) => {
    if (type === 'android') return 'Smartphone';
    if (type === 'ios') return 'Apple';
    return 'Layers';
  };

  const getOSColor = (os: OSConfig) => {
    if (os.theme === 'liquid-glass') return '#00f5ff';
    if (os.type === 'ios') return '#a78bfa';
    if (os.type === 'custom') return '#f59e0b';
    return '#22c55e';
  };

  const themeInfo = THEME_INFO[selected.theme];

  return (
    <div className="space-y-3">
      {/* Selected OS display */}
      <div className="glass rounded-xl p-4 border neon-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: selected.theme === 'liquid-glass'
                ? 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(124,58,237,0.2))'
                : `${getOSColor(selected)}20`,
              border: `1px solid ${getOSColor(selected)}40`,
              backdropFilter: selected.theme === 'liquid-glass' ? 'blur(10px)' : 'none',
            }}>
            <Icon name={getOSIcon(selected.type)} size={22} style={{ color: getOSColor(selected) }} />
          </div>
          <div>
            <div className="font-rajdhani font-bold text-base">{selected.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: `${getOSColor(selected)}20`, color: getOSColor(selected) }}>
                {selected.type === 'android' ? 'Android-like' : selected.type === 'ios' ? 'iOS-like' : 'Кастомная'}
              </span>
              {selected.customKernel && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-yellow-500/20 text-yellow-400">
                  Custom Kernel
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-muted-foreground text-[10px]">Тема</div>
            <div className="font-semibold mt-0.5" style={{ color: themeInfo.color }}>{themeInfo.label}</div>
            <div className="text-[9px] text-muted-foreground">{themeInfo.desc}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-muted-foreground text-[10px]">Анимации</div>
            <div className="font-semibold mt-0.5" style={{ color: getOSColor(selected) }}>
              {ANIMATION_LABELS[selected.animationLevel]}
            </div>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full"
                  style={{ background: i <= selected.animationLevel ? getOSColor(selected) : 'hsl(var(--muted))' }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-[10px] text-muted-foreground mb-1">Стиль иконок</div>
          <div className="flex gap-2">
            {['ios', 'android', 'custom'].map(style => (
              <div key={style} className="flex items-center gap-1 text-[10px]">
                <div className="w-3 h-3 rounded"
                  style={{
                    background: selected.iconStyle === style ? getOSColor(selected) : 'hsl(var(--muted))',
                    borderRadius: style === 'ios' ? '4px' : style === 'android' ? '50%' : '2px',
                  }}
                />
                <span className={selected.iconStyle === style ? 'text-foreground' : 'text-muted-foreground'}>
                  {style === 'ios' ? 'iOS' : style === 'android' ? 'Android' : 'Custom'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OS list */}
      <div className="space-y-2">
        {availableOS.map((os) => {
          const isSelected = os.id === selected.id;
          const color = getOSColor(os);

          return (
            <div
              key={os.id}
              onClick={() => onSelect(os)}
              className={`rounded-xl p-3 border cursor-pointer transition-all duration-200 ${
                isSelected ? 'selected-card bg-primary/5' : 'glass glass-hover border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                      backdropFilter: os.theme === 'liquid-glass' ? 'blur(10px)' : 'none',
                    }}>
                    <Icon name={getOSIcon(os.type)} size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{os.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {ANIMATION_LABELS[os.animationLevel]} анимации · {THEME_INFO[os.theme].label}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {os.customKernel && (
                    <div className="text-[9px] text-yellow-400 font-mono">Custom Kernel</div>
                  )}
                  <div className="flex gap-0.5 mt-1 justify-end">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 w-3 rounded-full"
                        style={{ background: i <= os.animationLevel ? color : 'hsl(var(--muted))' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isCustomOSUnlocked && (
        <div className="glass rounded-xl p-3 border border-yellow-500/20 text-center">
          <div className="text-yellow-400 text-xs font-mono">🔒 Кастомная ОС — откройте через исследования (50 000 ОИ)</div>
        </div>
      )}
    </div>
  );
}
