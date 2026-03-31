import { PhoneConfig, calcPhoneScore } from '@/store/gameStore';

interface PhonePreviewProps {
  phone: PhoneConfig;
}

export default function PhonePreview({ phone }: PhonePreviewProps) {
  const score = calcPhoneScore(phone);

  const getScreenGlow = () => {
    if (phone.screenType === 'oled') return '#00f5ff';
    if (phone.screenType === 'amoled') return '#7c3aed';
    return '#3b82f6';
  };

  const getCameraLayout = () => {
    const count = phone.cameras.reduce((s, c) => s + c.count, 0);
    if (count === 1) return 'single';
    if (count === 2) return 'dual';
    if (count === 3) return 'triple';
    return 'quad';
  };

  const cameraLayout = getCameraLayout();
  const glowColor = getScreenGlow();

  const materialStyle = {
    plastic: 'linear-gradient(145deg, #2a2a3e 0%, #1a1a2e 50%, #252535 100%)',
    aluminum: 'linear-gradient(145deg, #3a3a4a 0%, #1e1e2e 50%, #2d2d3d 100%)',
    titanium: 'linear-gradient(145deg, #4a4a5a 0%, #2a2a3a 40%, #3a3a4a 100%)',
    ceramic: 'linear-gradient(145deg, #f0f0ff 0%, #d0d0f0 50%, #e0e0ff 100%)',
  };

  const isCeramic = phone.material === 'ceramic';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative animate-float" style={{ animationDelay: '0s' }}>
        {/* Phone body */}
        <div
          className="relative rounded-[3rem] overflow-hidden"
          style={{
            width: '200px',
            height: '400px',
            background: materialStyle[phone.material],
            boxShadow: `0 0 40px ${glowColor}30, 0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`,
            border: `1px solid rgba(255,255,255,${isCeramic ? '0.3' : '0.08'})`,
          }}
        >
          {/* Side highlight */}
          <div
            className="absolute left-0 top-0 w-[2px] h-full rounded-l-[3rem]"
            style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))` }}
          />

          {/* Screen area */}
          <div
            className="absolute inset-[8px] rounded-[2.4rem] overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at 50% 20%, ${glowColor}20, #050510 60%)`,
              boxShadow: `inset 0 0 30px ${glowColor}10`,
            }}
          >
            {/* Dynamic island / notch */}
            <div className="flex justify-center pt-3">
              <div className="bg-black rounded-full" style={{ width: '80px', height: '12px' }} />
            </div>

            {/* Screen content */}
            <div className="flex flex-col items-center justify-center h-full pb-16">
              {/* OS Theme indicator */}
              {phone.os.theme === 'liquid-glass' && (
                <div className="w-28 h-28 rounded-full mb-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: `0 0 30px ${glowColor}40`
                  }}
                />
              )}

              {/* OS Name */}
              <div className="text-center px-2">
                <div className="text-xs font-mono" style={{ color: glowColor, opacity: 0.8 }}>
                  {phone.os.name}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {phone.brand}
                </div>
              </div>

              {/* App icons grid */}
              <div className="grid grid-cols-4 gap-1 mt-4 px-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl"
                    style={{
                      width: '24px',
                      height: '24px',
                      background: phone.os.iconStyle === 'ios'
                        ? `hsl(${i * 40}, 70%, 50%)`
                        : phone.os.theme === 'liquid-glass'
                          ? 'rgba(255,255,255,0.2)'
                          : `hsl(${i * 45}, 60%, 40%)`,
                      border: phone.os.theme === 'liquid-glass' ? '1px solid rgba(255,255,255,0.3)' : 'none',
                      backdropFilter: phone.os.theme === 'liquid-glass' ? 'blur(10px)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="rounded-full" style={{ width: '80px', height: '3px', background: 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>

          {/* Camera module */}
          <div
            className="absolute top-[12px] right-[12px]"
            style={{
              width: '54px',
              height: cameraLayout === 'quad' ? '80px' : cameraLayout === 'triple' ? '70px' : '54px',
              background: 'rgba(0,0,0,0.9)',
              borderRadius: '16px',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Main lens */}
            <div className="absolute top-[10px] left-[50%] -translate-x-1/2">
              <div className="rounded-full flex items-center justify-center"
                style={{
                  width: '30px', height: '30px',
                  background: 'radial-gradient(circle at 35% 35%, #334, #001)',
                  border: '2px solid #445',
                  boxShadow: `0 0 8px ${glowColor}60`,
                }}
              >
                <div className="rounded-full" style={{ width: '14px', height: '14px', background: 'radial-gradient(circle at 30% 30%, #446, #001)' }} />
              </div>
            </div>

            {/* Second lens */}
            {(cameraLayout === 'dual' || cameraLayout === 'triple' || cameraLayout === 'quad') && (
              <div className="absolute top-[46px] left-[50%] -translate-x-1/2">
                <div className="rounded-full flex items-center justify-center"
                  style={{ width: '22px', height: '22px', background: 'radial-gradient(circle at 35% 35%, #334, #001)', border: '2px solid #445' }}
                >
                  <div className="rounded-full" style={{ width: '10px', height: '10px', background: 'radial-gradient(circle at 30% 30%, #446, #001)' }} />
                </div>
              </div>
            )}

            {/* Third/fourth lens */}
            {(cameraLayout === 'triple' || cameraLayout === 'quad') && (
              <div className="absolute top-[46px] right-[4px]">
                <div className="rounded-full"
                  style={{ width: '16px', height: '16px', background: 'radial-gradient(circle at 35% 35%, #334, #001)', border: '2px solid #445' }}
                />
              </div>
            )}

            {/* Flash */}
            <div className="absolute bottom-[8px] right-[8px] rounded-full"
              style={{ width: '8px', height: '8px', background: '#fffde7', boxShadow: '0 0 6px #fff7' }}
            />
          </div>

          {/* Volume buttons */}
          <div className="absolute left-[-3px] top-[120px]">
            <div className="rounded-l-sm mb-2" style={{ width: '3px', height: '30px', background: 'rgba(255,255,255,0.15)' }} />
            <div className="rounded-l-sm mb-2" style={{ width: '3px', height: '30px', background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* Power button */}
          <div className="absolute right-[-3px] top-[140px]">
            <div className="rounded-r-sm" style={{ width: '3px', height: '45px', background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* Color overlay */}
          <div
            className="absolute inset-0 rounded-[3rem] pointer-events-none"
            style={{ background: `${phone.color}08`, mixBlendMode: 'overlay' }}
          />
        </div>

        {/* Shadow */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-xl"
          style={{ width: '140px', height: '20px', background: `${glowColor}20` }}
        />
      </div>

      {/* Phone stats */}
      <div className="w-full space-y-2 pt-2">
        <div className="text-center">
          <div className="font-rajdhani text-xl font-bold text-foreground">{phone.brand} {phone.name}</div>
          <div className="text-xs text-muted-foreground font-mono">{phone.chip.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="glass rounded-lg p-2 text-center">
            <div className="text-muted-foreground">Мощность</div>
            <div className="neon-text font-mono font-bold">{score.toLocaleString()}</div>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <div className="text-muted-foreground">Цена</div>
            <div className="gold-text font-mono font-bold">${phone.price}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 text-[10px]">
          <div className="glass rounded p-1.5 text-center">
            <div className="text-muted-foreground">Ядра</div>
            <div className="text-foreground font-mono">{phone.chip.cores}</div>
          </div>
          <div className="glass rounded p-1.5 text-center">
            <div className="text-muted-foreground">МГц</div>
            <div className="text-foreground font-mono">{phone.chip.maxFreq.toLocaleString()}</div>
          </div>
          <div className="glass rounded p-1.5 text-center">
            <div className="text-muted-foreground">нм</div>
            <div className="text-foreground font-mono">{phone.chip.process}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
