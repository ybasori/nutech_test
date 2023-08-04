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
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState<{
    id: string;
    title: { rendered: string };
    acf: {
      foto_barang: string;
      harga_beli: number;
      harga_jual: number;
      stok: number;
    };
  } | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState<string | null>(null);
  const { itemState, getAllItem } = useItem();
  const [params, setParams] = useState({ search: "" });
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [isReloading, setIsReloading] = useState(true);

  const onReload = useCallback(() => getAllItem(params), [params, getAllItem]);

  useEffect(() => {
    if (isReloading) {
      setIsReloading(false);
      onReload();
    }
  }, [onReload, isReloading]);
  return (
    <>
      <div className="columns">
        <div className="column is-three-fifths is-offset-one-fifth">
          <div className="columns">
            <div className="column">
              <form>
                <div className="field">
                  <Input
                    value={params.search}
                    onChange={(e) => {
                      setParams({ ...params, search: e.currentTarget.value });
                      setIsReloading(true);
                    }}
                    name="search"
                    placeholder="Search Item"
                  />
                </div>
              </form>
            </div>
            <div className="column is-one-third">
              <div className="columns">
                <div className="column">
                  <Button onClick={() => setIsReloading(true)}>Reload</Button>
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
                ? itemState.items
                    .filter((_, index) => {
                      const offset = (pagination.page - 1) * pagination.size;
                      return (
                        index >= offset && index < offset + pagination.size
                      );
                    })
                    .map((item, index) => (
                      <BoxItem
                        key={index}
                        picture={item.acf.foto_barang}
                        name={item.title.rendered}
                        sell={item.acf.harga_jual}
                        buy={item.acf.harga_beli}
                        stock={item.acf.stok}
                        onDelete={() => {
                          setIsOpenDelete(item.id);
                        }}
                        onEdit={() => setIsOpenEdit(item)}
                      />
                    ))
                : "No Data"}
            </>
          ) : (
            "Loading ..."
          )}
          {itemState.items?.length ? (
            <Pagination
              currentPage={pagination.page}
              totalPage={Math.ceil(itemState.items.length / pagination.size)}
              onChange={({ currentPage }) =>
                setPagination({ ...pagination, page: currentPage })
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
