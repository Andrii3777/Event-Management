import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabelledBy?: string;
  className?: string;
  zIndex?: string;
}

export function Modal({
  isOpen = true,
  onClose,
  children,
  ariaLabelledBy,
  className = "",
  zIndex = "z-50",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      className={`fixed inset-0 ${zIndex} flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm modal-backdrop-animate ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
