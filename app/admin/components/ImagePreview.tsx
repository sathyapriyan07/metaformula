import RemoteImage from "../../../components/RemoteImage";

export default function ImagePreview({ url }: { url?: string | null }) {
  if (!url || !url.startsWith("https://")) return null;
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10">
      <RemoteImage src={url} alt="Preview" fill className="object-cover" />
    </div>
  );
}
