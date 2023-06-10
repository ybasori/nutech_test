import React from "react";

const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  variant?: "" | "success" | "link" | "danger";
  loading?: boolean;
}> = ({ children, onClick, type = "button", variant = "", loading }) => {
  return (
    <>
      <button
        className={`button ${variant !== "" ? `is-${variant}` : ""} ${
          loading ? "is-loading" : ""
        }`}
        type={type}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
