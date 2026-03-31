import { CAMERAS, CameraConfig, GameState } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface CameraStudioProps {
  state: GameState;
  selected: CameraConfig;
  onSelect: (cam: CameraConfig) => void;
}

export default function CameraStudio({ state, selected, onSelect }: CameraStudioProps) {
  const isMultiCamUnlocked = state.unlockedTech.includes('multi_camera');

  const availableCameras = CAMERAS.filter(c => {
    if (c.count > 1) return isMultiCamUnlocked;
    return true;
  });

  const getMpColor = (mp: number) => {
    if (mp >= 200) return '#ff6b35';
    if (mp >= 100) return '#7c3aed';
    if (mp >= 50) return '#00f5ff';
    return '#22c55e';
  };

  const renderLens = (size: number, color: string) => (
    <div className="relative flex items-center justify-center rounded-full"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}30, #001)`,
        border: `2px solid ${color}50`,
        boxShadow: `0 0 ${size / 2}px ${color}40`,
      }}>
      <div className="rounded-full"
        style={{
          width: size * 0.5, height: size * 0.5,
          background: `radial-gradient(circle at 30% 30%, ${color}60, #002)`,
        }}
      />
      <div className="absolute rounded-full bg-white/20"
        style={{ width: size * 0.15, height: size * 0.15, top: '20%', left: '25%' }}
      />
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Selected camera preview */}
      <div className="glass rounded-xl p-4 border neon-border">
        <div className="flex gap-4 items-center mb-3">
          {/* Camera module visual */}
          <div className="rounded-2xl p-3 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #0d0d1a)',
              border: '1px solid rgba(255,255,255,0.05)',
              width: '72px',
            }}
          >
            <div className="flex flex-col items-center gap-1.5">
              {renderLens(36, getMpColor(selected.megapixels))}
              {selected.count >= 2 && renderLens(26, getMpColor(selected.megapixels))}
              {selected.count >= 3 && (
                <div className="flex gap-1">
                  {renderLens(20, getMpColor(selected.megapixels))}
                  <div className="rounded-full bg-yellow-100" style={{ width: 8, height: 8, marginTop: 6 }} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="font-rajdhani font-bold text-base">{selected.name}</div>
            <div className="text-[10px] font-mono text-muted-foreground">{selected.megapixels}МП · {selected.aperture} · {selected.count} объектив(а)</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {selected.features.map(f => (
                <span key={f} className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                  style={{ background: `${getMpColor(selected.megapixels)}20`, color: getMpColor(selected.megapixels) }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MP bar */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Разрешение</span>
            <span>{selected.megapixels} МП</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(selected.megapixels / 500) * 100}%`,
                background: `linear-gradient(90deg, ${getMpColor(selected.megapixels)}, ${getMpColor(selected.megapixels)}80)`,
                boxShadow: `0 0 8px ${getMpColor(selected.megapixels)}60`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Camera selector */}
      <div className="space-y-2">
        {availableCameras.map((cam) => {
          const isSelected = cam.id === selected.id;
          const color = getMpColor(cam.megapixels);

          return (
            <div
              key={cam.id}
              onClick={() => onSelect(cam)}
              className={`rounded-xl p-3 border cursor-pointer transition-all duration-200 ${
                isSelected ? 'selected-card bg-primary/5' : 'glass glass-hover border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon name="Camera" size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{cam.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {cam.count} объект. · {cam.aperture}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold" style={{ color }}>{cam.megapixels} МП</div>
                  <div className="text-[10px] text-muted-foreground">{cam.features.length} функций</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isMultiCamUnlocked && (
        <div className="glass rounded-xl p-3 border border-yellow-500/20 text-center">
          <div className="text-yellow-400 text-xs font-mono">🔒 Мультикамера — откройте через исследования (5 000 ОИ)</div>
        </div>
      )}
    </div>
  );
}
