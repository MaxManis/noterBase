import React, { ReactNode } from "react";
import s from "./Modal.module.css";

type Props = {
  title: string;
  text: ReactNode | string;
  buttons: ReactNode;
};

export const Modal: React.FC<Props> = ({ title, text, buttons }) => {
  return (
    <div className={s.modale}>
      <div className={s.content}>
        <div className={s.title}>{title}</div>
        <div className={s.text}>{text}</div>
      </div>
      <div className={s.actions}>
        <div className={s.buttons}>{buttons}</div>
      </div>
    </div>
  );
};
