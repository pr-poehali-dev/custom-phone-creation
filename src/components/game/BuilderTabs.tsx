import { GameState, PhoneConfig } from '@/store/gameStore';
import ChipLab from '@/components/ChipLab';
import CameraStudio from '@/components/CameraStudio';
import OSDesigner from '@/components/OSDesigner';
import ResearchPanel from '@/components/ResearchPanel';
import Icon from '@/components/ui/icon';

type Tab = 'chip' | 'camera' | 'os' | 'design' | 'research';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'chip', label: 'Чип', icon: 'Cpu' },
  { id: 'camera', label: 'Камеры', icon: 'Camera' },
  { id: 'os', label: 'ОС', icon: 'Layers' },
  { id: 'design', label: 'Дизайн', icon: 'Palette' },
  { id: 'research', label: 'Наука', icon: 'FlaskConical' },
];

const MATERIAL_LABELS: Record<string, string> = {
  plastic: 'Пластик', aluminum: 'Алюминий', titanium: 'Титан', ceramic: 'Керамика'
};

const BODY_COLORS = ['#0f172a', '#1a0a2e', '#0a1a0a', '#1a0a0a', '#1a1500', '#0a0a1a', '#c0c0c0', '#f0f0f0'];

interface BuilderTabsProps {
  state: GameState;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onPhoneUpdate: (updates: Partial<PhoneConfig>) => void;
  onUnlockTech: (techId: string, cost: number) => void;
}

export default function BuilderTabs({ state, activeTab, onTabChange, onPhoneUpdate, onUnlockTech }: BuilderTabsProps) {
  return (
    <div className="lg:col-span-1">
      <div className="glass rounded-xl p-1 flex gap-1 mb-4 border border-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-semibold transition-all ${
              activeTab === tab.id ? 'text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg, hsl(var(--neon)), hsl(var(--primary)))',
              boxShadow: '0 0 10px hsl(var(--neon) / 0.3)',
            } : {}}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div key={activeTab} className="animate-fade-in">
        {activeTab === 'chip' && (
          <ChipLab
            state={state}
            selected={state.currentPhone.chip}
            onSelect={chip => onPhoneUpdate({ chip })}
          />
        )}
        {activeTab === 'camera' && (
          <CameraStudio
            state={state}
            selected={state.currentPhone.cameras[0]}
            onSelect={cam => onPhoneUpdate({ cameras: [cam] })}
          />
        )}
        {activeTab === 'os' && (
          <OSDesigner
            state={state}
            selected={state.currentPhone.os}
            onSelect={os => onPhoneUpdate({ os })}
          />
        )}
        {activeTab === 'design' && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-border">
              <div className="font-rajdhani font-bold text-sm mb-3 flex items-center gap-2">
                <Icon name="Monitor" size={14} className="text-primary" />
                Тип экрана
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['lcd', 'amoled', 'oled'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => onPhoneUpdate({ screenType: type })}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                      state.currentPhone.screenType === type
                        ? 'border-primary/80 bg-primary/20 neon-text'
                        : 'border-border text-muted-foreground hover:border-border/60'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-border">
              <div className="font-rajdhani font-bold text-sm mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Maximize" size={14} className="text-primary" />
                  Размер экрана
                </div>
                <span className="neon-text font-mono">{state.currentPhone.screenSize}"</span>
              </div>
              <input
                type="range" min={4.0} max={7.5} step={0.1}
                value={state.currentPhone.screenSize}
                onChange={e => onPhoneUpdate({ screenSize: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>4.0" Компактный</span>
                <span>7.5" Планшет</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-border">
              <div className="font-rajdhani font-bold text-sm mb-3 flex items-center gap-2">
                <Icon name="Layers" size={14} className="text-primary" />
                Материал корпуса
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['plastic', 'aluminum', 'titanium', 'ceramic'] as const).map(mat => (
                  <button
                    key={mat}
                    onClick={() => onPhoneUpdate({ material: mat })}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                      state.currentPhone.material === mat
                        ? 'border-primary/80 bg-primary/20 neon-text'
                        : 'border-border text-muted-foreground hover:border-border/60'
                    }`}
                  >
                    {MATERIAL_LABELS[mat]}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-border">
              <div className="font-rajdhani font-bold text-sm mb-3 flex items-center gap-2">
                <Icon name="Palette" size={14} className="text-primary" />
                Цвет корпуса
              </div>
              <div className="flex gap-2 flex-wrap">
                {BODY_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => onPhoneUpdate({ color })}
                    className="w-8 h-8 rounded-lg transition-all border-2"
                    style={{
                      background: color,
                      borderColor: state.currentPhone.color === color ? 'hsl(var(--neon))' : 'transparent',
                      boxShadow: state.currentPhone.color === color ? `0 0 10px ${color}80` : 'none',
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={state.currentPhone.color}
                  onChange={e => onPhoneUpdate({ color: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border-2 border-border"
                  title="Свой цвет"
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'research' && (
          <ResearchPanel state={state} onUnlock={onUnlockTech} />
        )}
      </div>
    </div>
  );
}

export type { Tab };
