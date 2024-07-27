import { FC, PropsWithChildren } from "react";
import classnames from "classnames";

import "./Card.scss";

type CardType = {
  className?: string;
};

export const Card: FC<PropsWithChildren<CardType>> = (props) => {
  return (
    <div className={classnames("Card", props.className)}>
      <div className="Card__content">{props.children}</div>
    </div>
  );
};
