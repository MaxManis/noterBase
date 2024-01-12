import React from "react";
import "./Loader.css";

type Props = {
  isBlur?: boolean;
  isAbsolute?: boolean;
};

export const Loader: React.FC<Props> = ({ isBlur, isAbsolute }) => {
  let loaderClassNames = "";

  if (isBlur) {
    loaderClassNames += " loader-container-blur";
  }
  if (isAbsolute) {
    loaderClassNames += " loader-container-center";
  }

  return (
    <div className={loaderClassNames}>
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
