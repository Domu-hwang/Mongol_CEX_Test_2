import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn, dialogStyles } from '@/design-system';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div className={dialogStyles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className={cn(dialogStyles.content, className)}
      >
        {(title || showCloseButton) && (
          <div className={dialogStyles.header}>
            {title && (
              <h2 id="modal-title" className={dialogStyles.title}>
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className={dialogStyles.description}>
                {description}
              </p>
            )}
          </div>
        )}

        {showCloseButton && (
          <button
            onClick={onClose}
            className={dialogStyles.closeButton}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}

        <div>{children}</div>
      </div>
    </>,
    document.body
  );
};

// Sub-components for composition
const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(dialogStyles.header, className)} {...props} />;

const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => <h2 className={cn(dialogStyles.title, className)} {...props} />;

const ModalDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => <p className={cn(dialogStyles.description, className)} {...props} />;

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(dialogStyles.footer, className)} {...props} />;

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter };
export default Modal;
