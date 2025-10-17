interface PolaroidPhotoProps {
  src: string;
  alt: string;
  rotation?: number;
  className?: string;
}

export function PolaroidPhoto({ src, alt, rotation = 0, className = '' }: PolaroidPhotoProps) {
  return (
    <div
      className={`bg-white p-3 pb-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-48 object-cover"
      />
    </div>
  );
}
