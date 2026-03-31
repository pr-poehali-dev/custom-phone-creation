import { useState } from 'react';
import { GameState } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface AdminPanelProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onClose: () => void;
}

export default function AdminPanel({ state, onUpdate, onClose }: AdminPanelProps) {
  const [moneyInput, setMoneyInput] = useState(state.money.toString());
  const [rpInput, setRpInput] = useState(state.researchPoints.toString());

  const applyMoney = () => {
    const val = parseInt(moneyInput.replace(/\D/g, ''));
    if (!isNaN(val)) onUpdate({ money: Math.max(0, val) });
  };

  const applyRP = () => {
    const val = parseInt(rpInput.replace(/\D/g, ''));
    if (!isNaN(val)) onUpdate({ researchPoints: Math.min(state.totalResearchMax, Math.max(0, val)) });
  };

  const addMoney = (amount: number) => {
    const newVal = state.money + amount;
    onUpdate({ money: newVal });
    setMoneyInput(newVal.toString());
  };

  const addRP = (amount: number) => {
    const newVal = Math.min(state.totalResearchMax, state.researchPoints + amount);
    onUpdate({ researchPoints: newVal });
    setRpInput(newVal.toString());
  };

  const unlockAll = () => {
    onUpdate({
      unlockedTech: ['multi_camera', 'amoled', 'custom_os', 'custom_chip', 'liquid_glass', 'apex_chip'],
      researchPoints: 280000,
      money: state.money + 10000000,
    });
    setRpInput('280000');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-md mx-4 border border-red-500/30 animate-scale-in"
        style={{ boxShadow: '0 0 40px rgba(239,68,68,0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <Icon name="ShieldAlert" size={16} className="text-red-400" />
            </div>
            <div>
              <div className="font-rajdhani font-bold text-base">ADMIN PANEL</div>
              <div className="text-[10px] text-red-400 font-mono">RESTRICTED ACCESS</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Money control */}
          <div className="bg-muted/30 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="DollarSign" size={14} className="text-yellow-400" />
              <span className="font-rajdhani font-bold text-sm text-yellow-400">ДЕНЬГИ</span>
              <span className="ml-auto text-xs font-mono text-foreground">{state.money.toLocaleString()} $</span>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={moneyInput}
                onChange={e => setMoneyInput(e.target.value)}
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-mono border border-border focus:border-yellow-500/50 outline-none"
              />
              <button onClick={applyMoney}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30">
                ОК
              </button>
            </div>
            <div className="flex gap-2">
              {[100000, 1000000, 10000000].map(a => (
                <button key={a} onClick={() => addMoney(a)}
                  className="flex-1 text-[10px] py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors font-mono border border-yellow-500/20">
                  +{(a / 1000000).toFixed(1)}М
                </button>
              ))}
            </div>
          </div>

          {/* Research points control */}
          <div className="bg-muted/30 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="FlaskConical" size={14} className="text-primary" />
              <span className="font-rajdhani font-bold text-sm neon-text">ОЧКИ ИССЛЕДОВАНИЯ</span>
              <span className="ml-auto text-xs font-mono text-foreground">{state.researchPoints.toLocaleString()}</span>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={rpInput}
                onChange={e => setRpInput(e.target.value)}
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-mono border border-border focus:border-primary/50 outline-none"
              />
              <button onClick={applyRP}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                ОК
              </button>
            </div>
            <div className="flex gap-2">
              {[5000, 50000, 280000].map(a => (
                <button key={a} onClick={() => addRP(a)}
                  className="flex-1 text-[10px] py-1.5 rounded-lg bg-primary/10 neon-text hover:bg-primary/20 transition-colors font-mono border border-primary/20">
                  +{a >= 1000 ? `${(a/1000).toFixed(0)}K` : a}
                </button>
              ))}
            </div>
          </div>

          {/* Unlock all */}
          <button onClick={unlockAll}
            className="w-full py-3 rounded-xl font-rajdhani font-bold text-base transition-all border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            style={{ boxShadow: '0 0 20px rgba(239,68,68,0.1)' }}>
            ⚡ РАЗБЛОКИРОВАТЬ ВСЁ + 10М$
          </button>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <div className="text-muted-foreground">Телефонов выпущено</div>
              <div className="font-mono font-bold text-foreground">{state.phonesReleased}</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <div className="text-muted-foreground">Технологий открыто</div>
              <div className="font-mono font-bold neon-text">{state.unlockedTech.length} / 6</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
