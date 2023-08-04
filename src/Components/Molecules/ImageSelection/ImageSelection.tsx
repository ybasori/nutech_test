import React, { useEffect, useRef, useState } from "react";
import useMedia from "../../../Hooks/useMedia";
import Button from "../../Atoms/Button/Button";
import useLazyFetch from "../../../Hooks/useLazyFetch";
import ApiList from "../../../Config/ApiList";
import styles from "./ImageSelection.module.scss";

const ImageSelection: React.FC<{
  onDismiss: () => void;
  onChange: (value: { id: number; source_url: string }) => void;
}> = ({ onChange, onDismiss }) => {
  const { getMedia, mediaState } = useMedia();
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const browseRef = useRef<HTMLInputElement>(null);
  const [picture, setPicture] = useState<string | ArrayBuffer>("");
  const [form, setForm] = useState<{ file: File | null }>({ file: null });
  const [errorForm, setErrorForm] = useState<{ file: null | string }>({
    file: "",
  });

  const [onUpload, { loading }] = useLazyFetch<{
    id: number;
    source_url: string;
  }>({
    url: ApiList.MediaUrl,
    method: "POST",
  });

  const onSubmit = () => {
    setIsUploading(true);
  };

  useEffect(() => {
    if (isUploading && !loading) {
      setIsUploading(false);
      onUpload({ body: form }, (res, error) => {
        setIsFetching(true);
        if (!error) {
          onChange({
            id: res?.data.id ?? 0,
            source_url: res?.data.source_url ?? "",
          });
          onDismiss();
        }
      });
    }
  }, [isUploading, loading, form, onDismiss, onChange, onUpload]);

  useEffect(() => {
    if (isFetching && !mediaState.isLoadingMedias) {
      setIsFetching(false);
      getMedia();
    }
  }, [isFetching, mediaState.isLoadingMedias, getMedia]);

  useEffect(() => {
    setErrorForm({ file: "" });
    if ((form.file?.size ?? 0) / 1024 > 100) {
      setErrorForm({ file: "should be less than 100kb" });
    }
  }, [form.file]);
  return (
    <>
      <header className="modal-card-head">
        <p className="modal-card-title">Select Image</p>
      </header>

      <section className="modal-card-body">
        {picture !== "" && (
          <div>
            <img
              src={`${picture}`}
              className={styles["image-preview"]}
              onClick={() => browseRef.current?.click()}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg, image/png"
          ref={browseRef}
          hidden
          onChange={(e) => {
            if (e.currentTarget.files && e.currentTarget.files[0]) {
              const reader = new FileReader();
              const [file] = e.currentTarget.files;
              reader.onload = (ev) => {
                setPicture(ev.target?.result ?? "");
                setForm({ ...form, file });
              };
              reader.readAsDataURL(e.currentTarget.files[0]);
            }
          }}
        />
        {errorForm.file && (
          <div className={styles["error"]}>{errorForm.file}</div>
        )}
        {picture !== "" ? (
          <Button
            onClick={() => onSubmit()}
            disabled={
              Object.keys(errorForm)
                .map((key) => errorForm[key as keyof typeof errorForm])
                .filter((item) => item !== "").length > 0 ||
              loading ||
              mediaState.isLoadingMedias
            }
            loading={loading || mediaState.isLoadingMedias}
          >
            Upload
          </Button>
        ) : (
          <Button onClick={() => browseRef.current?.click()}>Browse</Button>
        )}

        <div className={styles["container-list"]}>
          {mediaState.isLoadingMedias ? (
            "Loading ..."
          ) : (
            <>
              {mediaState.medias?.map((item, key) => (
                <div
                  key={key}
                  className={styles["container-image"]}
                  onClick={() => {
                    onChange({
                      id: item.id ?? 0,
                      source_url: item.source_url ?? "",
                    });
                    onDismiss();
                  }}
                >
                  <img src={item.source_url} className={styles["image"]} />
                </div>
              ))}
            </>
          )}
        </div>
      </section>
      <footer className="modal-card-foot"></footer>
    </>
  );
};

export default ImageSelection;
