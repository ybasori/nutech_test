import React from "react";

const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  variant?: "" | "success" | "link" | "danger";
  loading?: boolean;
  disabled?: boolean;
}> = ({
  children,
  onClick,
  type = "button",
  variant = "",
  loading,
  disabled = false,
}) => {
  return (
    <>
      <button
        className={`button ${variant !== "" ? `is-${variant}` : ""} ${
          loading ? "is-loading" : ""
        }`}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
