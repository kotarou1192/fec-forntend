import React, { useState } from "react";
import { Menubar } from "./menubar";
import "../styles/app.css";
import { Search } from "./search";
import { Mypage } from "./mypage";

export const baseURL = "http://localhost:3000";

export const App = () => {
  const [selectedMenu, changeSelectedMenu] = useState<string>("home");
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [activeIconName, changeActiveIconName] = useState<string>("home");

  const setContentAndMenubar = (content: JSX.Element | null, name: string) => {
    setContent(content);
    changeActiveIconName(name);
  };

  const switchContent = (name: string) => {
    if (content != null) {
      return content;
    }
    switch (name) {
      case "home":
        return <p>これはホームです</p>;
      case "search":
        return <Search setContent={setContentAndMenubar} />;
      case "mypage":
        return <Mypage setContent={setContentAndMenubar} />;

      default:
        return <div></div>;
    }
  };

  return (
    <div className="container">
      <Menubar
        selected={selectedMenu}
        activeIconName={activeIconName}
        changeSelectedMenu={changeSelectedMenu}
        setContent={setContent}
        changeActiveIconName={changeActiveIconName}
      />
      <div id="content" className="content">
        {switchContent(selectedMenu)}
      </div>
    </div>
  );
};
