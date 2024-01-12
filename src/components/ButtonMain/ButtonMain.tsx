import React from "react";

type Props = {
  buttonText: any;
  onClick?: () => void;
};

export const ButtonMain: React.FC<Props> = ({ buttonText, onClick }) => {
  return (
    <button
      className="button--main menuButtons button--main-active"
      type="button"
      id="all"
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};
