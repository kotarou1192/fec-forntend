import React, { useState } from "react";
import { baseURL } from "../auth/baseURL";
import { logout } from "../auth/logout";
import "../styles/profile.css";
import defaultIcon from "../icons/default.png";

interface User {
  name: string;
  nickname: string;
  explanation: string;
  icon: any;
  is_admin: boolean;
  is_mypage: boolean;
}

interface SetMode {
  setMode: (mode: Mode) => void;
}

export const Profile = (props: User & SetMode) => {
  const user = props;

  const bye = async () => {
    await logout();
    props.setMode("NotLogIn");
  };

  return (
    <div>
      <div className="profile">
        <input
          className="profile__logout"
          type="submit"
          value="logout"
          onClick={() => bye()}
        ></input>
        <input
          className="profile__edit"
          type="submit"
          value="編集"
          onClick={() => props.setMode("edit")}
        ></input>
        <img
          src={user.icon != null ? baseURL + user.icon : defaultIcon}
          className="profile__image"
        ></img>
        <p className="profile__name">@{user.name}</p>
        <p className="profile__nickname">{user.nickname}</p>
        <p className="profile__exp">{user.explanation}</p>
      </div>
      <div>投稿一覧</div>
    </div>
  );
};
