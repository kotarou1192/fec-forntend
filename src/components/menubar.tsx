// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import "../styles/menu-bar.css";

interface Props {
  selected: string;
  activeIconName: string;
  changeSelectedMenu: (str: string) => void;
  setContent: (e: JSX.Element | null) => void;
  changeActiveIconName: (e: string) => void;
}

export const Menubar = (props: Props): JSX.Element => {
  const setCurrent = (name: string) => {
    props.changeActiveIconName(name);
    props.changeSelectedMenu(name);
    props.setContent(null);
  };

  return (
    <div className="menu">
      <div
        className={
          props.activeIconName === "home"
            ? "menu__icon menu__home__active"
            : "menu__icon menu__home"
        }
        onClick={() => {
          setCurrent("home");
        }}
      ></div>
      <div
        className={
          props.activeIconName === "search"
            ? "menu__icon menu__search__active"
            : "menu__icon menu__search"
        }
        onClick={() => {
          setCurrent("search");
        }}
      ></div>
      <div
        className={
          props.activeIconName === "mypage"
            ? "menu__icon menu__mypage__active"
            : "menu__icon menu__mypage"
        }
        onClick={() => {
          setCurrent("mypage");
        }}
      ></div>
    </div>
  );
};
