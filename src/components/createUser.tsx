import React, { useState } from "react";
import { baseURL } from "../auth/baseURL";
import axios from "axios";

export const CreateUser = (props: { setMode: (mode: Mode) => void }) => {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const createUser = () => {
    const url = baseURL + "/api/v1/users";
    const body = {
      value: {
        email,
        name: id,
        password,
        nickname,
      },
    };
    axios.post(url, body).then((response) => {
      console.log(response.data.body);
      if (response.data.status === "SUCCESS") return props.setMode("NotLogIn");
      window.alert("どこか間違ってる");
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      ></input>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      ></input>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <input
        type="password"
        placeholder="password confirmation"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      ></input>
      <input type="submit" value="create" onClick={createUser}></input>
      <input
        type="submit"
        value="戻る"
        onClick={() => props.setMode("TryLogIn")}
      ></input>
    </div>
  );
};
