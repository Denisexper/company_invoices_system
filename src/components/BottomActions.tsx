interface Props {
  docType: string;
  onPreview: () => void;
  onShare: () => void;
}

export default function BottomActions({ docType, onPreview, onShare }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex gap-2 px-4 py-3 z-[100] max-w-lg lg:max-w-2xl mx-auto"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <button
        onClick={onPreview}
        className="flex-1 py-3.5 rounded-xl bg-gradient-to-br from-brand-green to-brand-dark text-white font-bold text-sm tracking-wide active:scale-[0.97] transition"
      >
        Preview {docType}
      </button>
      <button
        onClick={onShare}
        className="py-3.5 px-5 rounded-xl border-2 border-brand-green text-brand-green font-bold text-sm active:scale-[0.97] transition hover:bg-brand-green/5"
      >
        Share
      </button>
    </div>
  );
}