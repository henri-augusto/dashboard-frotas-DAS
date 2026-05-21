"use client";

import { ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 cursor-default bg-primary/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="surface-noise relative z-10 flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col rounded-2xl bg-panel/95 shadow-[0_24px_60px_rgba(60,42,30,0.18)] ring-1 ring-border/70"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border/60 px-5 py-5 sm:px-6">
          <h2 id={titleId} className="text-xl font-semibold tracking-tight text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 cursor-pointer rounded-lg px-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-primary"
            aria-label="Fechar"
          >
            Fechar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
