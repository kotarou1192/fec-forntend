import React, { useState } from "react";
import { baseURL } from "./app";
import Cookies from "js-cookie";
import axios from "axios";
import { Tooltip } from "@material-ui/core";
import { refresh } from "../auth/refresh";
import { Mypage } from "./mypage";
import "../styles/profile.css";

interface User {
  name: string;
  nickname: string;
  explanation: string;
  icon: string;
  is_admin: boolean;
  is_mypage: boolean;
}

interface Props {
  setContent: (content: JSX.Element | null, name: string) => void;
  user: User;
}

export const EditProfile = (props: Props) => {
  const [image, setImage] = useState<File>();
  const [nickname, setNickname] = useState<string>(props.user.nickname);
  const [name, setName] = useState<string>(props.user.name);
  const [exp, setExp] = useState<string>(
    props.user.explanation != null ? props.user.explanation : ""
  );
  const [nameError, setNameError] = useState({
    message: "",
    isOpen: false,
  });
  const [nicknameError, setNicknameError] = useState({
    message: "",
    isOpen: false,
  });
  const [expError, setExpError] = useState({
    message: "",
    isOpen: false,
  });
  const [messageOfButton, setErrorToButton] = useState("none");

  const updateAll = () => {
    Promise.all([updateIcon(), updateProfile()]).then((responses) => {
      let isErrorOccured = false;
      responses.forEach((status) => {
        isErrorOccured = isErrorOccured ? true : status === false;
      });
      if (!isErrorOccured) {
        exitEditMode();
      }
    });
  };

  const updateProfile = async () => {
    const url = baseURL + `/api/v1/users/${props.user.name}`;
    return await axios
      .put(url, {
        token: { onetime: Cookies.get("onetime") },
        value: { name: name, nickname: nickname, explanation: exp },
      })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status === "SUCCESS") {
          const success = {
            isOpen: true,
            message: "",
          };
          setNameError(success);
          setNicknameError(success);
          setExpError(success);
          return true;
        } else if (res.data.status === "OLD_TOKEN") {
          // token refresh
          refresh().then((res) => {
            if (res === "SUCCESS") {
              updateProfile();
              return;
            }
            props.setContent(
              <Mypage setContent={props.setContent} />,
              "mypage"
            );
          });
        }
        console.log(res.data.body.messages);
        Object.keys(res.data.body.messages).forEach((key) => {
          console.log(res.data.body.messages[key].join("\n"));
          if (key === "name") {
            setNameError({
              isOpen: true,
              message: key + ":" + res.data.body.messages[key].join("\n"),
            });
          }
          if (key === "nickname") {
            setNicknameError({
              isOpen: true,
              message: key + ":" + res.data.body.messages[key].join("\n"),
            });
          }
          if (key === "explanation") {
            setExpError({
              isOpen: true,
              message: key + ":" + res.data.body.messages[key].join("\n"),
            });
          }
        });
        return false;
      });
  };

  const updateIcon = async () => {
    if (image == null) return true;
    const url = baseURL + `/api/v1/users/${props.user.name}`;
    const formData = new FormData();
    formData.append("icon", image);
    const onetime_token = { token: { onetime: Cookies.get("onetime") } };

    formData.append("token", JSON.stringify(onetime_token));

    console.log(image.name);
    const exp = /.*\.(jpg|jpeg|png)/;
    if (!exp.exec(image.name)) {
      console.log("invalid file");
      setErrorToButton("指定されたファイルは画像ではないです");
      return false;
    }

    return await axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data.status);
        if (response.data.status === "SUCCESS") {
          setErrorToButton("");
          return true;
        } else if (response.data.status === "OLD_TOKEN") {
          // token refresh
          refresh().then((res) => {
            if (res === "SUCCESS") {
              return updateIcon();
            }
            props.setContent(
              <Mypage setContent={props.setContent} />,
              "mypage"
            );
            return false;
          });
        }
        return false;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const exitEditMode = () => {
    props.setContent(
      <Mypage {...props.user} setContent={props.setContent} />,
      "mypage"
    );
  };

  return (
    <div className="profile">
      <input type="submit" value="戻る" onClick={exitEditMode}></input>
      <input
        name="item"
        type="file"
        id="picture"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.item(0);
          if (file == null) return;
          setImage(file);
        }}
      ></input>
      <Tooltip
        title={nameError.message}
        open={nameError.isOpen}
        placement="right"
      >
        <input
          className="profile__name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
      </Tooltip>
      <Tooltip
        title={nicknameError.message}
        open={nicknameError.isOpen}
        placement="right"
      >
        <input
          className="profile__nickname"
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
          }}
        ></input>
      </Tooltip>
      <Tooltip
        title={expError.message}
        open={expError.isOpen}
        placement="right"
      >
        <textarea
          value={exp}
          onChange={(e) => {
            setExp(e.target.value);
          }}
        ></textarea>
      </Tooltip>
      <Tooltip
        title={messageOfButton}
        open={messageOfButton !== "none"}
        placement="right"
      >
        <input type="submit" onClick={updateAll}></input>
      </Tooltip>
    </div>
  );
};