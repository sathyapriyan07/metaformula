export default function Footer({ text }: { text: string }) {
  return (
    <footer className="max-w-7xl mx-auto px-8 py-12 mt-20">
      <div className="glass rounded-2xl px-6 py-4 text-center text-sm text-white/50">
        {text}
      </div>
    </footer>
  );
}
