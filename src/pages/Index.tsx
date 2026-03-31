import { useState, useCallback } from 'react';
import { DEFAULT_STATE, GameState, ERAS, calcPhoneRating } from '@/store/gameStore';
import PhonePreview from '@/components/PhonePreview';
import ChipLab from '@/components/ChipLab';
import CameraStudio from '@/components/CameraStudio';
import OSDesigner from '@/components/OSDesigner';
import ResearchPanel from '@/components/ResearchPanel';
import AdminPanel from '@/components/AdminPanel';
import MarketPresentation from '@/components/MarketPresentation';
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

export default function Index() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<Tab>('chip');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const notify = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updatePhone = useCallback((updates: Partial<typeof state.currentPhone>) => {
    setState(prev => ({
      ...prev,
      currentPhone: { ...prev.currentPhone, ...updates }
    }));
  }, []);

  const handleUnlockTech = useCallback((techId: string, cost: number) => {
    if (state.researchPoints < cost) {
      notify('Недостаточно очков исследования!', 'error');
      return;
    }
    setState(prev => ({
      ...prev,
      researchPoints: prev.researchPoints - cost,
      unlockedTech: [...prev.unlockedTech, techId],
    }));
    notify('Технология разблокирована!', 'success');
  }, [state.researchPoints, notify]);

  const handleRelease = useCallback((price: number) => {
    const rating = calcPhoneRating(state.currentPhone);
    const sales = Math.round(rating * 1000);
    const earned = price * sales;
    const rpEarned = Math.round(rating * 500);

    setState(prev => ({
      ...prev,
      money: prev.money + earned,
      researchPoints: Math.min(prev.totalResearchMax, prev.researchPoints + rpEarned),
      phonesReleased: prev.phonesReleased + 1,
      ratings: [
        ...prev.ratings,
        { name: `${state.currentPhone.brand} ${state.currentPhone.name}`, score: rating, price }
      ],
    }));

    setShowMarket(false);
    notify(`🎉 ${sales.toLocaleString()} продаж! Заработано $${earned.toLocaleString()}`, 'success');
  }, [state.currentPhone, notify]);

  const handleAdminLogin = () => {
    if (adminCode === 'ADMIN2026') {
      setShowAdmin(true);
      setShowAdminLogin(false);
      setAdminCode('');
    } else {
      notify('Неверный код доступа', 'error');
    }
  };

  const notifColor = notification?.type === 'success'
    ? 'border-green-500/50 bg-green-500/10 text-green-400'
    : notification?.type === 'error'
    ? 'border-red-500/50 bg-red-500/10 text-red-400'
    : 'border-primary/50 bg-primary/10 neon-text';

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-sm font-semibold animate-fade-in ${notifColor}`}
          style={{ backdropFilter: 'blur(12px)' }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
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
            {/* Money */}
            <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Icon name="DollarSign" size={14} className="text-yellow-400" />
              <span className="font-mono text-sm font-bold text-yellow-400">{(state.money / 1000000).toFixed(1)}М</span>
            </div>

            {/* Research points */}
            <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Icon name="FlaskConical" size={14} className="text-primary" />
              <span className="font-mono text-sm font-bold neon-text">{state.researchPoints.toLocaleString()} ОИ</span>
            </div>

            {/* Phones released */}
            <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Icon name="Package" size={14} className="text-muted-foreground" />
              <span className="font-mono text-sm text-foreground">{state.phonesReleased} шт.</span>
            </div>

            {/* Admin */}
            <button
              onClick={() => setShowAdminLogin(true)}
              className="glass rounded-lg px-2 py-1.5 text-muted-foreground hover:text-red-400 transition-colors border border-border hover:border-red-500/30"
              title="Панель администратора"
            >
              <Icon name="ShieldAlert" size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-6">

        {/* LEFT — Phone preview */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-5 border border-border sticky top-24">
            <div className="font-rajdhani font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="Eye" size={14} />
              Предпросмотр
            </div>

            <PhonePreview phone={state.currentPhone} />

            {/* Brand & Name */}
            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={state.currentPhone.brand}
                onChange={e => updatePhone({ brand: e.target.value })}
                placeholder="Бренд"
                className="w-full bg-muted rounded-lg px-3 py-2 text-sm border border-border focus:border-primary/50 outline-none font-mono"
              />
              <input
                type="text"
                value={state.currentPhone.name}
                onChange={e => updatePhone({ name: e.target.value })}
                placeholder="Название модели"
                className="w-full bg-muted rounded-lg px-3 py-2 text-sm border border-border focus:border-primary/50 outline-none font-mono"
              />
            </div>

            {/* Price */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Цена ($)</span>
                <span className="gold-text font-mono font-bold">${state.currentPhone.price}</span>
              </div>
              <input
                type="range" min={99} max={3999} step={50}
                value={state.currentPhone.price}
                onChange={e => updatePhone({ price: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$99</span><span>$3999</span>
              </div>
            </div>

            {/* Battery */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Батарея</span>
                <span className="text-foreground font-mono">{state.currentPhone.battery} мАч</span>
              </div>
              <input
                type="range" min={1000} max={10000} step={100}
                value={state.currentPhone.battery}
                onChange={e => updatePhone({ battery: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Release button */}
            <button
              onClick={() => setShowMarket(true)}
              className="mt-4 w-full py-3 rounded-xl font-rajdhani font-bold text-base transition-all"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--neon) / 0.9), hsl(195 100% 35%))',
                boxShadow: '0 0 25px hsl(var(--neon) / 0.3)',
                color: '#050510',
              }}>
              🚀 ВЫПУСТИТЬ НА РЫНОК
            </button>
          </div>
        </div>

        {/* CENTER — Tabs */}
        <div className="lg:col-span-1">
          {/* Tab bar */}
          <div className="glass rounded-xl p-1 flex gap-1 mb-4 border border-border">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

          {/* Tab content */}
          <div key={activeTab} className="animate-fade-in">
            {activeTab === 'chip' && (
              <ChipLab
                state={state}
                selected={state.currentPhone.chip}
                onSelect={chip => updatePhone({ chip })}
              />
            )}
            {activeTab === 'camera' && (
              <CameraStudio
                state={state}
                selected={state.currentPhone.cameras[0]}
                onSelect={cam => updatePhone({ cameras: [cam] })}
              />
            )}
            {activeTab === 'os' && (
              <OSDesigner
                state={state}
                selected={state.currentPhone.os}
                onSelect={os => updatePhone({ os })}
              />
            )}
            {activeTab === 'design' && (
              <div className="space-y-4">
                {/* Screen type */}
                <div className="glass rounded-xl p-4 border border-border">
                  <div className="font-rajdhani font-bold text-sm mb-3 flex items-center gap-2">
                    <Icon name="Monitor" size={14} className="text-primary" />
                    Тип экрана
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['lcd', 'amoled', 'oled'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => updatePhone({ screenType: type })}
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

                {/* Screen size */}
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
                    onChange={e => updatePhone({ screenSize: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>4.0" Компактный</span>
                    <span>7.5" Планшет</span>
                  </div>
                </div>

                {/* Material */}
                <div className="glass rounded-xl p-4 border border-border">
                  <div className="font-rajdhani font-bold text-sm mb-3 flex items-center gap-2">
                    <Icon name="Layers" size={14} className="text-primary" />
                    Материал корпуса
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['plastic', 'aluminum', 'titanium', 'ceramic'] as const).map(mat => (
                      <button
                        key={mat}
                        onClick={() => updatePhone({ material: mat })}
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

                {/* Color */}
                <div className="glass rounded-xl p-4 border border-border">
                  <div className="font-rajdhani font-bold text-sm mb-3 flex items-center gap-2">
                    <Icon name="Palette" size={14} className="text-primary" />
                    Цвет корпуса
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {BODY_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => updatePhone({ color })}
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
                      onChange={e => updatePhone({ color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-2 border-border"
                      title="Свой цвет"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'research' && (
              <ResearchPanel state={state} onUnlock={handleUnlockTech} />
            )}
          </div>
        </div>

        {/* RIGHT — Stats & history */}
        <div className="lg:col-span-1 space-y-4">
          {/* Era selector */}
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
                    onClick={() => updateState({ era: era.id })}
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

          {/* Release history */}
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

          {/* Tips */}
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
      </div>

      {/* Admin login */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAdminLogin(false)} />
          <div className="relative glass rounded-2xl p-6 w-80 border border-red-500/30 animate-scale-in">
            <div className="font-rajdhani font-bold text-base mb-4 text-red-400">ДОСТУП АДМИНИСТРАТОРА</div>
            <input
              type="password"
              value={adminCode}
              onChange={e => setAdminCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Код доступа..."
              className="w-full bg-muted rounded-lg px-3 py-2 text-sm font-mono border border-border focus:border-red-500/50 outline-none mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setShowAdminLogin(false)}
                className="flex-1 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-colors">
                Отмена
              </button>
              <button onClick={handleAdminLogin}
                className="flex-1 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors font-semibold">
                Войти
              </button>
            </div>
            <div className="text-[10px] text-muted-foreground text-center mt-2 opacity-50">Подсказка: ADMIN2026</div>
          </div>
        </div>
      )}

      {showAdmin && (
        <AdminPanel state={state} onUpdate={updateState} onClose={() => setShowAdmin(false)} />
      )}

      {showMarket && (
        <MarketPresentation phone={state.currentPhone} onRelease={handleRelease} onClose={() => setShowMarket(false)} />
      )}
    </div>
  );
}