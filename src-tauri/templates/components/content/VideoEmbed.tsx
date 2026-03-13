import styles from "./VideoEmbed.module.css";

interface VideoEmbedProps {
  videoUrl: string;
  title?: string;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

export default function VideoEmbed({
  videoUrl,
  title = "Video",
}: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className={styles.container}>
        <video className={styles.video} controls title={title}>
          <source src={videoUrl} />
        </video>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
