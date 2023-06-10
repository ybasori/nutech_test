/* eslint-disable indent */
import React, { useEffect, useRef, useState } from "react";
import Input from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button/Button";
import useLazyFetch from "../../../Hooks/useLazyFetch";
import useUser from "../../../Hooks/useUser";
import Modal from "../../Atoms/Modal/Modal";
import FormLogin from "../FormLogin/FormLogin";

const FormCreateEditItem: React.FC<{
  isEdit?: {
    name: string;
    picture: string;
    buy: number;
    sell: number;
    stock: number;
    uid: string;
  };
  onDismiss?: () => void;
  onSubmit: () => void;
}> = ({ isEdit = undefined, onDismiss, onSubmit: afterSubmit }) => {
  const { user, onLogout } = useUser();
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [picture, setPicture] = useState("");
  const [form, setForm] = useState<{
    picture: File | null;
    name: string;
    buy: string;
    sell: string;
    stock: string;
  }>({
    picture: null,
    name: "",
    buy: "",
    sell: "",
    stock: "",
  });
  const [errorForm, setErrorForm] = useState({
    picture: "",
    name: "",
    buy: "",
    sell: "",
    stock: "",
  });
  const onChangeInput = (e: {
    currentTarget: { name: string; value: string; files?: FileList | null };
  }) => {
    setErrorForm({ ...errorForm, [e.currentTarget.name]: "" });
    setForm({
      ...form,
      [e.currentTarget.name]:
        e.currentTarget.name === "picture"
          ? e.currentTarget.files?.[0]
          : e.currentTarget.value,
    });
  };

  const validate =
    (handleSubmit: () => void) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let errInput = { ...errorForm };
      Object.keys(form).map((key) => {
        const keyInput = key as keyof typeof form;
        if (isEdit) {
          if (
            !form[keyInput] &&
            form[keyInput] === "" &&
            form[keyInput] !== null
          ) {
            errInput = { ...errInput, [keyInput]: "required!" };
          }
        } else {
          if (!form[keyInput] && form[keyInput] === "") {
            errInput = { ...errInput, [keyInput]: "required!" };
          }
        }
        if (keyInput === "picture" && form[keyInput] !== null) {
          if ((form.picture?.size ?? 0) / 1024 > 100) {
            errInput = { ...errInput, [keyInput]: "should be less than 100kb" };
          }
        }
      });
      setErrorForm({ ...errInput });
      if (
        Object.keys(errInput)
          .map((key) => errInput[key as keyof typeof errInput])
          .filter((item) => item !== "").length === 0
      ) {
        return handleSubmit();
      }
    };

  const [onNewItem, { loading }] = useLazyFetch({
    url: "/api/v1/items",
    method: "POST",
  });
  const [onEditItem, { loading: editLoading }] = useLazyFetch({
    url: `/api/v1/items/${isEdit?.uid}/edit`,
    method: "POST",
  });
  const [onAvailableName, { loading: availableLoading }] = useLazyFetch({
    url: "/api/v1/items/available-name",
    method: "POST",
  });

  const onSubmit = () => {
    if (!isEdit) {
      onNewItem({ ...form, authorization: user.token ?? "" }, (_, error) => {
        if (error) {
          console.log(error);
        } else {
          afterSubmit();
          onDismiss?.();
        }
      });
    } else {
      onEditItem({ ...form, authorization: user.token ?? "" }, (_, error) => {
        if (error) {
          console.log(error);
        } else {
          afterSubmit();
          onDismiss?.();
        }
      });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setPicture(`http://localhost:8000/${isEdit.picture}`);
      setForm({
        picture: null,
        name: isEdit.name,
        buy: isEdit.buy.toString(),
        sell: isEdit.sell.toString(),
        stock: isEdit.stock.toString(),
      });
    }
  }, []);

  return (
    <>
      <header className="modal-card-head">
        <p className="modal-card-title">{isEdit ? "Edit Item" : "Add Item"}</p>
        <button
          className="delete"
          aria-label="close"
          onClick={onDismiss}
        ></button>
      </header>

      <section className="modal-card-body">
        <form onSubmit={validate(onSubmit)}>
          <Input
            value={picture}
            onChange={(e) => {
              setPicture(e.currentTarget.value);
              onChangeInput(e);
            }}
            name="picture"
            placeholder="Image"
            label={"Picture"}
            type="image"
            error={errorForm.picture}
          />
          <Input
            value={form.name}
            onChange={(e) => {
              onChangeInput(e);
              onAvailableName(
                {
                  name: e.currentTarget.value,
                  ...(isEdit ? { except: isEdit.uid } : {}),
                  authorization: user.token,
                },
                (data, error) => {
                  if (!error) {
                    if (data?.data.data !== 1) {
                      setErrorForm({
                        ...errorForm,
                        name: "Name not available",
                      });
                    }
                  }
                }
              );
            }}
            name="name"
            placeholder="Name"
            label={"Name"}
            error={errorForm.name}
            valid={""}
            loading={availableLoading}
          />
          <Input
            min={0}
            value={form.buy}
            onChange={onChangeInput}
            name="buy"
            placeholder="Buy"
            label={"Buy"}
            type={"number"}
            error={errorForm.buy}
          />
          <Input
            min={0}
            value={form.sell}
            onChange={onChangeInput}
            name="sell"
            placeholder="Sell"
            label={"Sell"}
            type={"number"}
            error={errorForm.sell}
          />
          <Input
            min={0}
            value={form.stock}
            onChange={onChangeInput}
            name="stock"
            placeholder="Stock"
            label={"Stock"}
            type={"number"}
            error={errorForm.stock}
          />
          <button
            type="submit"
            style={{ display: "none" }}
            ref={submitBtnRef}
          />
        </form>
      </section>
      <footer className="modal-card-foot">
        <Button
          type="button"
          variant="success"
          onClick={() => submitBtnRef.current?.click()}
          loading={loading || editLoading}
        >
          Save changes
        </Button>
        <Button type="button" onClick={onDismiss}>
          Cancel
        </Button>
        <p>
          Signed in as {user.name}.{" "}
          <a
            className={"is-link"}
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            Change?
          </a>
        </p>
      </footer>

      {!user.isLogin && (
        <Modal onDismiss={onDismiss}>
          <FormLogin onDismiss={onDismiss} />
        </Modal>
      )}
    </>
  );
};

export default FormCreateEditItem;
