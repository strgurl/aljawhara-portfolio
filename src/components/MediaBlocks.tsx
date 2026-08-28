import { useLocale } from "@/lib/i18n";
import type { MediaImage, MediaVideo } from "@/types/conversation";

export function ImageBlock({ image }: { image: MediaImage }) {
  const { t } = useLocale();
  return (
    <figure className="overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]">
      {/* Capped and contained rather than cropped: a tall phone screenshot
          would otherwise take over the sheet, and cropping a UI shot loses
          exactly the part worth seeing. */}
      <img
        src={image.src}
        alt={t(image.alt)}
        className="max-h-[560px] w-full object-contain"
        loading="lazy"
      />
      {image.caption && (
        <figcaption className="px-4 py-2.5 text-[13px] text-[var(--color-ink-secondary)]">
          {t(image.caption)}
        </figcaption>
      )}
    </figure>
  );
}

export function VideoBlock({ video }: { video: MediaVideo }) {
  const { t } = useLocale();
  return (
    <figure className="overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]">
      <video
        src={video.src}
        poster={video.poster}
        controls
        playsInline
        // Only headers until the visitor presses play, so opening a sheet
        // never pulls the whole file down.
        preload="metadata"
        className="max-h-[560px] w-full"
      />
      {video.caption && (
        <figcaption className="px-4 py-2.5 text-[13px] text-[var(--color-ink-secondary)]">
          {t(video.caption)}
        </figcaption>
      )}
    </figure>
  );
}
