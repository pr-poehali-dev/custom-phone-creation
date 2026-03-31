import { useState, useCallback } from 'react';
import { DEFAULT_STATE, GameState, calcPhoneRating } from '@/store/gameStore';
import AdminPanel from '@/components/AdminPanel';
import MarketPresentation from '@/components/MarketPresentation';
import GameHeader from '@/components/game/GameHeader';
import PhonePanel from '@/components/game/PhonePanel';
import BuilderTabs, { Tab } from '@/components/game/BuilderTabs';
import SidePanel from '@/components/game/SidePanel';
import AdminLoginModal from '@/components/game/AdminLoginModal';

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
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-sm font-semibold animate-fade-in ${notifColor}`}
          style={{ backdropFilter: 'blur(12px)' }}>
          {notification.msg}
        </div>
      )}

      <GameHeader state={state} onAdminClick={() => setShowAdminLogin(true)} />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-6">
        <div className="lg:col-span-1">
          <PhonePanel
            phone={state.currentPhone}
            onPhoneUpdate={updatePhone}
            onRelease={() => setShowMarket(true)}
          />
        </div>

        <BuilderTabs
          state={state}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPhoneUpdate={updatePhone}
          onUnlockTech={handleUnlockTech}
        />

        <SidePanel
          state={state}
          onEraChange={era => updateState({ era })}
        />
      </div>

      {showAdminLogin && (
        <AdminLoginModal
          adminCode={adminCode}
          onCodeChange={setAdminCode}
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
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
