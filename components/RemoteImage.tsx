import Image from "next/image";
import clsx from "clsx";

interface RemoteImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  height?: number;
  width?: number;
}

export default function RemoteImage({ src, alt, className, fill, height, width }: RemoteImageProps) {
  if (!src) return null;
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={clsx("object-contain max-w-full", className)}
        unoptimized
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 600}
      height={height ?? 400}
      className={clsx("object-contain max-w-full", className)}
      unoptimized
    />
  );
}
