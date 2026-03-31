import { PhoneConfig, calcPhoneScore, calcPhoneRating } from '@/store/gameStore';
import Icon from '@/components/ui/icon';

interface MarketPresentationProps {
  phone: PhoneConfig;
  onRelease: (price: number) => void;
  onClose: () => void;
}

const REVIEWER_NAMES = ['TechReview Pro', 'MobileWorld', 'GadgetGuru', 'PhoneInsider', 'DigiLabs'];

export default function MarketPresentation({ phone, onRelease, onClose }: MarketPresentationProps) {
  const score = calcPhoneScore(phone);
  const rating = calcPhoneRating(phone);
  const [price, setPrice] = [phone.price, () => {}];

  const getStarColor = (r: number) => {
    if (r >= 8) return '#22c55e';
    if (r >= 6) return '#f59e0b';
    if (r >= 4) return '#f97316';
    return '#ef4444';
  };

  const getRatingLabel = (r: number) => {
    if (r >= 9) return 'ШЕДЕВР';
    if (r >= 8) return 'ОТЛИЧНО';
    if (r >= 6) return 'ХОРОШО';
    if (r >= 4) return 'СРЕДНЕ';
    return 'СЛАБО';
  };

  const starColor = getStarColor(rating);
  const ratingLabel = getRatingLabel(rating);

  const reviews = REVIEWER_NAMES.map(name => ({
    name,
    score: Math.max(1, Math.min(10, rating + (Math.random() * 2 - 1))).toFixed(1),
    comment: rating >= 8 ? 'Лучший телефон этого года!' : rating >= 6 ? 'Достойный вариант за эту цену' : 'Слишком дорого за такие характеристики',
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-lg mx-4 border border-primary/30 animate-scale-in"
        style={{ boxShadow: '0 0 60px hsl(var(--neon) / 0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-rajdhani font-bold text-xl neon-text">ПРЕЗЕНТАЦИЯ ТЕЛЕФОНА</div>
            <div className="text-xs text-muted-foreground font-mono">Рыночный анализ и оценка</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Phone name */}
        <div className="text-center py-4 border-b border-border mb-4">
          <div className="font-rajdhani font-bold text-2xl">{phone.brand} {phone.name}</div>
          <div className="text-sm text-muted-foreground">{phone.chip.name} · {phone.cameras.reduce((s,c) => s+c.count, 0)} камеры · {phone.os.name}</div>
        </div>

        {/* Score & Rating */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-muted-foreground text-xs mb-1">Мощность устройства</div>
            <div className="font-rajdhani text-3xl font-bold neon-text">{score.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground font-mono">performance score</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-muted-foreground text-xs mb-1">Рыночная оценка</div>
            <div className="font-rajdhani text-3xl font-bold" style={{ color: starColor }}>{rating.toFixed(1)}</div>
            <div className="text-[10px] font-mono font-bold" style={{ color: starColor }}>{ratingLabel}</div>
          </div>
        </div>

        {/* Price bar */}
        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Цена продажи</span>
            <span className="font-rajdhani text-xl font-bold gold-text">${phone.price}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Рекомендуемая цена: <span className="text-foreground font-mono">${Math.round(score / 50).toLocaleString()}</span>
          </div>
          {phone.price > score / 50 * 1.5 && (
            <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <Icon name="AlertTriangle" size={12} />
              Цена сильно завышена — это снизит оценку покупателей
            </div>
          )}
          {phone.price < score / 50 * 0.7 && (
            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
              <Icon name="TrendingUp" size={12} />
              Отличная цена — покупатели будут в восторге!
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="space-y-2 mb-5">
          <div className="font-rajdhani text-sm font-bold text-muted-foreground uppercase">Мнения экспертов</div>
          {reviews.slice(0, 3).map((rev, i) => (
            <div key={i} className="glass rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold">{rev.name}</div>
                <div className="text-[10px] text-muted-foreground">{rev.comment}</div>
              </div>
              <div className="text-lg font-rajdhani font-bold" style={{ color: getStarColor(parseFloat(rev.score)) }}>
                {rev.score}
              </div>
            </div>
          ))}
        </div>

        {/* Earnings estimate */}
        <div className="glass rounded-xl p-3 mb-5 border border-green-500/20">
          <div className="text-xs text-muted-foreground mb-1">Ожидаемая прибыль</div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Продажи: ~{Math.round(rating * 1000).toLocaleString()} шт.
            </div>
            <div className="font-rajdhani font-bold text-green-400">
              ${(phone.price * rating * 1000).toLocaleString()}
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground">+{Math.round(rating * 500).toLocaleString()} очков исследования</div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
            Отмена
          </button>
          <button
            onClick={() => onRelease(phone.price)}
            className="flex-2 flex-1 py-3 rounded-xl font-rajdhani font-bold text-base transition-all border border-primary/50 text-primary-foreground"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--neon)), hsl(var(--primary)))',
              boxShadow: '0 0 20px hsl(var(--neon) / 0.4)',
              flex: 2,
            }}>
            🚀 ВЫПУСТИТЬ НА РЫНОК
          </button>
        </div>
      </div>
    </div>
  );
}
