import React from "react";

const Modal: React.FC<{
  children?: React.ReactNode;
  onDismiss?: () => void;
}> = ({ children, onDismiss }) => {
  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={onDismiss}></div>
        <div className="modal-card">{children}</div>
      </div>
    </>
  );
};

export default Modal;
