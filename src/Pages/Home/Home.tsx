/* eslint-disable indent */
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Components/Atoms/Modal/Modal";
import Button from "../../Components/Atoms/Button/Button";
import Input from "../../Components/Atoms/Input/Input";
import BoxItem from "../../Components/Molecules/BoxItem/BoxItem";
import FormCreateEditItem from "../../Components/Molecules/FormCreateEditItem/FormCreateEditItem";
import Pagination from "../../Components/Molecules/Pagination/Pagination";
import ConfirmDeleteItem from "../../Components/Molecules/ConfirmDeleteItem/ConfirmDeleteItem";
import useItem from "../../Hooks/useItem";
import useUser from "../../Hooks/useUser";

function App() {
  useUser();
  const [pictureDelete, setPictureDelete] = useState<string | null>(null);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<{
    picture: string;
    name: string;
    buy: number;
    sell: number;
    stock: number;
    uid: string;
  } | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState<string | null>(null);
  const { itemState, getAllItem } = useItem();
  const [params, setParams] = useState({ page: 1, size: 10, keyword: "" });

  const onReload = useCallback(() => getAllItem(params), [params]);

  useEffect(() => {
    onReload();
  }, [onReload]);
  return (
    <>
      <div className="columns">
        <div className="column is-three-fifths is-offset-one-fifth">
          <div className="columns">
            <div className="column">
              <form>
                <div className="field">
                  <Input
                    value={params.keyword}
                    onChange={(e) =>
                      setParams({ ...params, keyword: e.currentTarget.value })
                    }
                    name="search"
                    placeholder="Search Item"
                  />
                </div>
              </form>
            </div>
            <div className="column">
              <div className="columns">
                <div className="column">
                  <Button onClick={() => onReload()}>Reload</Button>
                </div>
                <div className="column">
                  <Button onClick={() => setIsOpenAdd(true)}>Add Item</Button>
                </div>
              </div>
            </div>
          </div>
          {!itemState.isLoadingItems ? (
            <>
              {itemState.items && itemState.items.length !== 0
                ? itemState.items.map((item, index) => (
                    <BoxItem
                      key={index}
                      picture={item.picture}
                      name={item.name}
                      sell={item.sell}
                      buy={item.buy}
                      stock={item.stock}
                      onDelete={() => {
                        setIsOpenDelete(item.uid);
                        setPictureDelete(item.picture);
                      }}
                      onEdit={() => setIsOpenEdit(item)}
                    />
                  ))
                : "No Data"}
            </>
          ) : (
            "Loading ..."
          )}
          {itemState.totalItems ? (
            <Pagination
              currentPage={params.page}
              totalPage={Math.ceil(itemState.totalItems / params.size)}
              onChange={({ currentPage }) =>
                setParams({ ...params, page: currentPage })
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {isOpenAdd && (
        <Modal onDismiss={() => setIsOpenAdd(false)}>
          <FormCreateEditItem
            onDismiss={() => setIsOpenAdd(false)}
            onSubmit={onReload}
          />
        </Modal>
      )}
      {isOpenEdit && (
        <Modal onDismiss={() => setIsOpenEdit(null)}>
          <FormCreateEditItem
            isEdit={isOpenEdit}
            onDismiss={() => setIsOpenEdit(null)}
            onSubmit={onReload}
          />
        </Modal>
      )}
      {!!isOpenDelete && (
        <Modal onDismiss={() => setIsOpenDelete(null)}>
          <ConfirmDeleteItem
            picture={pictureDelete ?? ""}
            uid={isOpenDelete}
            onSubmit={onReload}
            onDismiss={() => setIsOpenDelete(null)}
          />
        </Modal>
      )}
    </>
  );
}

export default App;
