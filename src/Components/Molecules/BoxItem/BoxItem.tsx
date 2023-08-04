import React, { useEffect, useState } from "react";
import Button from "../../Atoms/Button/Button";
import useLazyFetch from "../../../Hooks/useLazyFetch";
import ApiList from "../../../Config/ApiList";

const defaultImage =
  "https://thenounproject.com/api/private/icons/2616533/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";

const BoxItem: React.FC<{
  picture: string;
  name: string;
  sell: number;
  buy: number;
  stock: number;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ picture, name, sell, buy, stock, onDelete, onEdit }) => {
  const [idPicture, setIdPicture] = useState<null | string>(null);
  const [isGettingImage, setIsGettingImage] = useState(false);
  const [onGetImage, { data }] = useLazyFetch<{
    id: number;
    source_url: string;
  }>({
    url: ApiList.MediaUrl,
    method: "GET",
  });

  useEffect(() => {
    if (picture !== idPicture) {
      setIdPicture(picture);
      setIsGettingImage(true);
    }
  }, [picture, idPicture]);

  useEffect(() => {
    if (isGettingImage && picture && !isNaN(Number(picture))) {
      setIsGettingImage(false);
      onGetImage({
        path: `/${picture}`,
      });
    }
  }, [picture, onGetImage, isGettingImage]);
  return (
    <>
      <div className="box">
        <article className="media">
          <div className="media-left">
            <figure className="image is-64x64" style={{ overflow: "hidden" }}>
              <img src={data?.source_url ?? defaultImage} alt="item" />
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
