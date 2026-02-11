export default function Footer({ text }: { text: string }) {
  return (
    <footer className="mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6 md:px-8 pb-14">
      <div className="glass rounded-2xl px-5 py-4 text-sm text-f1-muted">{text}</div>
    </footer>
  );
}
