"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type SecretVisualNovelImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

const CLICK_TARGET = 5;
const CLICK_WINDOW_MS = 2200;
const LONG_PRESS_MS = 900;

export default function SecretVisualNovelImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: SecretVisualNovelImageProps) {
  const router = useRouter();
  const clickCount = useRef(0);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggered = useRef(false);

  const openVisualNovel = () => {
    if (triggered.current) return;
    triggered.current = true;
    router.push("/visual-novel");
  };

  const handleClick = () => {
    clickCount.current += 1;

    if (clickResetTimer.current) {
      clearTimeout(clickResetTimer.current);
    }

    if (clickCount.current >= CLICK_TARGET) {
      openVisualNovel();
      return;
    }

    clickResetTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, CLICK_WINDOW_MS);
  };

  const startLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(openVisualNovel, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={startLongPress}
      onPointerUp={cancelLongPress}
      onPointerCancel={cancelLongPress}
      onPointerLeave={cancelLongPress}
      onContextMenu={(event) => event.preventDefault()}
      className="relative z-10 cursor-pointer border-0 bg-transparent p-0 select-none"
      aria-label="Mascot Umado"
      title="Mascot Umado"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        draggable={false}
      />
    </button>
  );
}
