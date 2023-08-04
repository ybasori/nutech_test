/* eslint-disable indent */
import React, { useEffect, useRef, useState } from "react";
import Input from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button/Button";
import useLazyFetch from "../../../Hooks/useLazyFetch";
import useUser from "../../../Hooks/useUser";
import Modal from "../../Atoms/Modal/Modal";
import FormLogin from "../FormLogin/FormLogin";
import ApiList from "../../../Config/ApiList";

const FormCreateEditItem: React.FC<{
  isEdit?: {
    id: string;
    title: { rendered: string };
    acf: {
      foto_barang: string;
      harga_beli: number;
      harga_jual: number;
      stok: number;
    };
  };
  onDismiss?: () => void;
  onSubmit: () => void;
}> = ({ isEdit = undefined, onDismiss, onSubmit: afterSubmit }) => {
  const { user, onLogout } = useUser();
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [counter, setCounter] = useState(0);
  const [form, setForm] = useState<{
    picture: string;
    name: string;
    buy: string;
    sell: string;
    stock: string;
  }>({
    picture: "",
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
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const validate =
    (handleSubmit: () => void) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let errInput = { ...errorForm };
      Object.keys(form).map((key) => {
        const keyInput = key as keyof typeof form;
        if (!form[keyInput] || form[keyInput] === "") {
          errInput = { ...errInput, [keyInput]: "required!" };
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
    url: ApiList.BarangUrl,
    method: "POST",
  });
  const [onEditItem, { loading: editLoading }] = useLazyFetch({
    url: ApiList.BarangUrl,
    method: "POST",
  });
  const [onAvailableName, { loading: availableLoading }] = useLazyFetch({
    url: ApiList.BarangUrl,
    method: "GET",
  });

  const onSubmit = () => {
    if (!isEdit) {
      onNewItem(
        {
          body: {
            title: form.name,
            status: "publish",
            fields: {
              harga_beli: form.buy,
              harga_jual: form.sell,
              stok: form.stock,
              foto_barang: form.picture,
            },
          },
        },
        (_, error) => {
          if (!error) {
            afterSubmit();
            onDismiss?.();
          }
        }
      );
    } else {
      onEditItem(
        {
          path: `/${isEdit.id}`,
          body: {
            title: form.name,
            status: "publish",
            fields: {
              harga_beli: form.buy,
              harga_jual: form.sell,
              stok: form.stock,
              foto_barang: form.picture,
            },
          },
        },
        (_, error) => {
          if (!error) {
            afterSubmit();
            onDismiss?.();
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isEdit) {
      setForm({
        picture: isEdit.acf.foto_barang,
        name: isEdit.title.rendered,
        buy: isEdit.acf.harga_beli.toString(),
        sell: isEdit.acf.harga_jual.toString(),
        stock: isEdit.acf.stok.toString(),
      });
    }
  }, [isEdit]);

  useEffect(() => {
    if (form.name !== "" && counter === 0) {
      setIsChecking(true);
    }
  }, [counter, form.name]);
  useEffect(() => {
    setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);
  }, []);
  useEffect(() => {
    if (isChecking && !availableLoading) {
      setIsChecking(false);
      onAvailableName(
        {
          path: `?search=${form.name}`,
        },
        (data, error) => {
          if (!error) {
            if (
              data?.data.length > 0 &&
              data?.data[0].title.rendered === form.name &&
              data?.data[0].id !== isEdit?.id
            ) {
              setErrorForm({
                ...errorForm,
                name: "Name not available",
              });
            }
          }
        }
      );
    }
  }, [
    isChecking,
    availableLoading,
    errorForm,
    form.name,
    isEdit?.id,
    onAvailableName,
  ]);

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
            value={form.picture}
            onChange={(e) => {
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
              setCounter(1);
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
            disabled={counter > 0 || loading || editLoading || availableLoading}
          />
        </form>
      </section>
      <footer className="modal-card-foot">
        <Button
          type="button"
          variant="success"
          onClick={() => submitBtnRef.current?.click()}
          loading={loading || editLoading || counter > 0 || availableLoading}
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
