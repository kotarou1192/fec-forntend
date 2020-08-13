// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import "../styles/mypage.css";
import { baseURL } from "../auth/baseURL";
import axios from "axios";
import Cookies from "js-cookie";
import { Profile } from "./profile";
import { refresh } from "../auth/refresh";
import { LoginForm } from "./loginform";
import { EditProfile } from "./editProfile";
import { CreateUser } from "./createUser";

interface Props {
  setContent: (content: JSX.Element | null, name: string) => void;
}

type Mode = "NotLogIn" | "TryLogIn" | "default" | "edit" | "CreateUser";

interface User {
  name: string;
  nickname: string;
  explanation: string;
  icon: any;
  is_admin: boolean;
  is_mypage: boolean;
}

export const Mypage = (props: Props): JSX.Element => {
  const [user, setUser] = useState<User>();
  const [mode, setMode] = useState<Mode>("TryLogIn");

  const getMyData = async () => {
    const url = baseURL + "/api/v1/auth";
    return axios
      .get(url, { params: { token: Cookies.get("onetime") } })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          setUser(response.data.body);
          return setMode("default");
        } else if (response.data.status === "OLD_TOKEN") {
          console.log("old_token");
          // ワンタイムトークン再取得をここでする
          refresh().then((res) => {
            if (res === "SUCCESS") {
              getMyData();
              return;
            }
          });
        } else if (response.data.status === "FAILED") {
          refresh().then((res) => {
            if (res === "SUCCESS") return getMyData();
          });
        }
        setMode("NotLogIn");
      });
  };
  if (mode === "TryLogIn") {
    getMyData();
    return <div>loading...</div>;
  } else if (mode === "NotLogIn") {
    return <LoginForm setMode={setMode} />;
  } else if (mode === "default" && user != null) {
    return <Profile {...user} setMode={setMode} />;
  } else if (mode === "edit" && user != null) {
    return <EditProfile {...user} setMode={setMode} />;
  } else if (mode === "CreateUser") {
    return <CreateUser setMode={setMode} />;
  }

  return <div></div>;
};
