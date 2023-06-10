import React from "react";
import Button from "../../Atoms/Button/Button";

const BoxItem: React.FC<{
  picture: string;
  name: string;
  sell: number;
  buy: number;
  stock: number;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ picture, name, sell, buy, stock, onDelete, onEdit }) => {
  return (
    <>
      <div className="box">
        <article className="media">
          <div className="media-left">
            <figure className="image is-64x64" style={{ overflow: "hidden" }}>
              <img src={picture} alt="item" />
            </figure>
          </div>
          <div className="media-content is-flex">
            <div className="content">
              <p>
                <strong>{name}</strong>
                <br />
                Sell: {sell} | Buy: {buy} | Stock: {stock}
              </p>
            </div>
            <nav className="buttons are-small ml-auto">
              <Button variant="link" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>
            </nav>
          </div>
        </article>
      </div>
    </>
  );
};

export default BoxItem;
