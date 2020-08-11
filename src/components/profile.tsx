import React, { useState } from "react";
import { baseURL } from "./app";
import { logout } from "../auth/logout";
import { Mypage } from "./mypage";
import { EditProfile } from "./editProfile";
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

interface SetContent {
  setContent: (content: JSX.Element | null, name: string) => void;
}

export const Profile = (props: User & SetContent) => {
  const [isEditMode, switchEditMode] = useState<boolean>(false);
  const user = props;

  const bye = async () => {
    await logout();
    return props.setContent(<Mypage setContent={props.setContent} />, "mypage");
  };

  if (isEditMode) {
    return <EditProfile setContent={props.setContent} user={user} />;
  } else {
    return (
      <div>
        <div className="profile">
          <input
            className="profile__edit"
            type="submit"
            value="編集"
            onClick={() => switchEditMode(!isEditMode)}
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
  }
};
