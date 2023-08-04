import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import ImageSelection from "../../Molecules/ImageSelection/ImageSelection";
import useLazyFetch from "../../../Hooks/useLazyFetch";
import ApiList from "../../../Config/ApiList";

const Input: React.FC<{
  value: string;
  onChange: (event: {
    currentTarget: { value: string; name: string; picture?: string };
  }) => void;
  name: string;
  placeholder: string;
  label?: string;
  type?: "text" | "number" | "image" | "password";
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
  const [isOpenModalImage, setIsOpenModalImage] = useState(false);

  const [isGettingImage, setIsGettingImage] = useState(true);

  const [onGetImage, { data, loading: isLoading }] = useLazyFetch<{
    id: number;
    source_url: string;
  }>({
    url: ApiList.MediaUrl,
    method: "GET",
  });

  useEffect(() => {
    if (value && isGettingImage && type === "image" && !isNaN(Number(value))) {
      setIsGettingImage(false);
      onGetImage({
        path: `/${value}`,
      });
    }
  }, [value, type, onGetImage, isGettingImage]);

  return (
    <>
      <div className="field">
        {label && <label className="label">{label}</label>}
        <div
          className={`control ${
            error !== "" || valid !== "" ? "has-icons-right" : ""
          } ${loading ? "is-loading" : ""}`}
        >
          {type === "image" && value && (
            <div>
              {!isLoading ? (
                <img
                  src={data?.source_url ?? ""}
                  style={{ height: 200, width: "100%", objectFit: "cover" }}
                />
              ) : (
                <>Loading ...</>
              )}
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
              if (type !== "image") {
                return onChange(e);
              }
            }}
            name={name}
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
            <>
              <Button onClick={() => setIsOpenModalImage(true)}>
                {value === "" ? "Select" : "Change"} {placeholder}
              </Button>
              {isOpenModalImage && (
                <Modal onDismiss={() => setIsOpenModalImage(false)}>
                  <ImageSelection
                    onDismiss={() => setIsOpenModalImage(false)}
                    onChange={(e) => {
                      setIsGettingImage(true);
                      onChange({
                        currentTarget: {
                          name,
                          value: `${e.id}` ?? "",
                        },
                      });
                    }}
                  />
                </Modal>
              )}
            </>
          )}
        </div>
        {valid !== "" && <p className="help is-success">{valid}</p>}
        {error !== "" && <p className="help is-danger">{error}</p>}
      </div>
    </>
  );
};

export default Input;
