import React from "react";

const ButtonPage: React.FC<{
  number: number;
  current?: boolean;
  onClick: () => void;
}> = ({ number, current = false, onClick }) => {
  return (
    <>
      <li>
        <a
          className={`pagination-link ${current && "is-current"}`}
          aria-label={`Goto page ${number}`}
          onClick={(e) => {
            e.preventDefault();
            return onClick();
          }}
        >
          {number}
        </a>
      </li>
    </>
  );
};

export default ButtonPage;
