import React, { useRef } from "react";
import Button from "../Button/Button";

const Input: React.FC<{
  value: string;
  onChange: (event: {
    currentTarget: { value: string; name: string; files?: FileList | null };
  }) => void;
  name: string;
  placeholder: string;
  label?: string;
  type?: "text" | "number" | "image";
  error?: string;
  loading?: boolean;
  valid?: string;
  min?: string | number;
}> = ({
  value,
  onChange,
  name,
  placeholder,
  label,
  type = "text",
  error = "",
  loading = false,
  valid = "",
  min,
}) => {
  const browseRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="field">
        {label && <label className="label">{label}</label>}
        <div
          className={`control ${
            error !== "" || valid !== "" ? "has-icons-right" : ""
          } ${loading ? "is-loading" : ""}`}
        >
          {type === "image" && value !== "" && (
            <div>
              <img
                src={value}
                style={{ height: 200, width: "100%", objectFit: "cover" }}
              />
            </div>
          )}
          <input
            min={min}
            autoComplete={type === "image" ? undefined : "off"}
            style={{ ...(type === "image" ? { display: "none" } : {}) }}
            className={`input ${error !== "" ? "is-danger" : ""} ${
              valid !== "" ? "is-success" : ""
            }`}
            type={type === "image" ? "file" : type}
            placeholder={placeholder}
            value={type === "image" ? undefined : value}
            accept={type === "image" ? "image/jpeg, image/png" : undefined}
            onChange={(e) => {
              if (type === "image") {
                if (e.currentTarget.files && e.currentTarget.files[0]) {
                  const reader = new FileReader();
                  const files = e.currentTarget.files;
                  reader.onload = (ev) => {
                    onChange({
                      currentTarget: {
                        name,
                        value: `${ev.target?.result}` ?? "",
                        files,
                      },
                    });
                  };
                  reader.readAsDataURL(e.currentTarget.files[0]);
                }
              } else {
                return onChange(e);
              }
            }}
            name={name}
            ref={type === "image" ? browseRef : undefined}
          />

          {error !== "" && (
            <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
          )}
          {valid !== "" && (
            <span className="icon is-small is-right">
              <i className="fas fa-check"></i>
            </span>
          )}
          {type === "image" && (
            <Button onClick={() => browseRef.current?.click()}>
              {value === "" ? "Select" : "Change"} {placeholder}
            </Button>
          )}
        </div>
        {valid !== "" && <p className="help is-success">{valid}</p>}
        {error !== "" && <p className="help is-danger">{error}</p>}
      </div>
    </>
  );
};

export default Input;
