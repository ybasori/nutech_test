import React, { useRef, useState } from "react";
import useUser from "../../../Hooks/useUser";
import Input from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button/Button";

const FormLogin: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { user, onLogin } = useUser();
  const [form, setForm] = useState<{
    name: string;
  }>({
    name: "",
  });
  const [errorForm, setErrorForm] = useState({
    name: "",
  });
  const submitBtnRef = useRef<HTMLButtonElement>(null);
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
        if (!form[keyInput] && form[keyInput] === "") {
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
  const onSubmit = () => {
    onLogin(form);
  };
  return (
    <>
      <header className="modal-card-head">
        <p className="modal-card-title">Login</p>
      </header>

      <section className="modal-card-body">
        <form onSubmit={validate(onSubmit)}>
          <Input
            value={form.name}
            onChange={(e) => onChangeInput(e)}
            name="name"
            placeholder="Name"
            label={"Name"}
            error={errorForm.name}
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
          loading={user.loading}
        >
          Login
        </Button>
        <Button type="button" onClick={onDismiss}>
          Cancel
        </Button>
      </footer>
    </>
  );
};

export default FormLogin;
