import React, { useEffect } from "react";

// styles
import "./Dialog.scss";
type DialogProps = {
  title: string;
  message: string;
  onClose: () => void;
  onCancel: () => void;
  onOk: () => void;
};

export const Dialog: React.FC<DialogProps> = ({
  title,
  message,
  onClose,
  onCancel,
  onOk,
}) => {
  useEffect(() => {
    const dialog = document.querySelector(
      ".wheel-of-destiny-33kl__dialog"
    ) as HTMLDialogElement;
    dialog.showModal();

    return () => {
      dialog.close();
    };
  }, []);

  return (
    <dialog className='wheel-of-destiny-33kl__dialog border-0 rounded bg-gamma'>
      <button
        className='dialog-33kl__close bg-nu btn-icon p-0 mb-2 position-relative d-block'
        onClick={onClose}
      >
        <span className='icon icon-close-outline color-alpha'></span>
      </button>
      <h2 className='mb-4 color-alpha text-center'>{title}</h2>
      <p className='mb-4 color-alpha text-center'>{message}</p>
      <div className='dialog-33kl__ctas d-flex align-items-center justify-content-center gap-4'>
        <button className='bg-danger color-alpha w-100' onClick={onCancel}>
          Delete & rotate
        </button>
        <button className='bg-success color-primary w-100' onClick={onOk}>
          Keep & rotate
        </button>
      </div>
    </dialog>
  );
};
