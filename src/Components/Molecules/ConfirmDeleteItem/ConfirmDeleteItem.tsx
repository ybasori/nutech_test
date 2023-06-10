import React from "react";
import Button from "../../Atoms/Button/Button";
import useLazyFetch from "../../../Hooks/useLazyFetch";
import useUser from "../../../Hooks/useUser";
import Modal from "../../Atoms/Modal/Modal";
import FormLogin from "../FormLogin/FormLogin";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../firebase";

const ConfirmDeleteItem: React.FC<{
  onDismiss?: () => void;
  uid: string;
  onSubmit: () => void;
  picture: string;
}> = ({ onDismiss, uid, onSubmit, picture }) => {
  const { user, onLogout } = useUser();
  const [onDelete, { loading }] = useLazyFetch({
    url: `/api/v1/items/${uid}/delete`,
    method: "POST",
  });
  return (
    <>
      <header className="modal-card-head">
        <p className="modal-card-title">Are you sure?</p>
        <button
          className="delete"
          aria-label="close"
          onClick={onDismiss}
        ></button>
      </header>
      <footer className="modal-card-foot">
        <Button
          variant="success"
          type={"button"}
          loading={loading}
          onClick={() => {
            return onDelete({ authorization: user.token }, () => {
              deleteObject(ref(storage, picture));
              onSubmit();
              onDismiss?.();
            });
          }}
        >
          Yes
        </Button>
        <Button type={"button"} onClick={onDismiss}>
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

export default ConfirmDeleteItem;
