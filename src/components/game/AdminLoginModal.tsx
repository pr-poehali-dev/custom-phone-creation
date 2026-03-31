interface AdminLoginModalProps {
  adminCode: string;
  onCodeChange: (code: string) => void;
  onLogin: () => void;
  onClose: () => void;
}

export default function AdminLoginModal({ adminCode, onCodeChange, onLogin, onClose }: AdminLoginModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-80 border border-red-500/30 animate-scale-in">
        <div className="font-rajdhani font-bold text-base mb-4 text-red-400">ДОСТУП АДМИНИСТРАТОРА</div>
        <input
          type="password"
          value={adminCode}
          onChange={e => onCodeChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onLogin()}
          placeholder="Код доступа..."
          className="w-full bg-muted rounded-lg px-3 py-2 text-sm font-mono border border-border focus:border-red-500/50 outline-none mb-3"
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-colors">
            Отмена
          </button>
          <button onClick={onLogin}
            className="flex-1 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors font-semibold">
            Войти
          </button>
        </div>
        <div className="text-[10px] text-muted-foreground text-center mt-2 opacity-50">Подсказка: admin123</div>
      </div>
    </div>
  );
}