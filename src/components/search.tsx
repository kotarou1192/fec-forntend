// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import "../styles/search.css";
import { baseURL } from "../auth/baseURL";
import axios from "axios";
import { Mypage } from "./mypage";
import Cookies from "js-cookie";
import { refresh } from "../auth/refresh";
import defaultIcon from "../icons/default.png";

interface Props {
  setContent: (content: JSX.Element | null, name: string) => void;
}

export const Search = (props: Props): JSX.Element => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchUserResults, setSearchUserResults] = useState<any[]>([]);

  const searchUser = () => {
    fetchUser()
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          setSearchUserResults(response.data.body);
        } else if (response.data.status === "OLD_TOKEN") {
          // ワンタイムトークン再取得処理
          console.log("old_token");
          refresh().then((res) => {
            if (res === "SUCCESS") {
              searchUser();
              return;
            }
          });
        }
        console.log(response.data.status);
      })
      .catch((e) => {
        console.error(e);
        setSearchUserResults([]);
      });
  };

  const fetchUser = async () => {
    const userURL = baseURL + `/api/v1/users/${searchText}`;
    const response = await axios.get(userURL, {
      params: { token: Cookies.get("onetime") },
    });
    return response;
  };

  const displyUser = (index: number) => {
    const user = searchUserResults[index];
    const content = (
      <div>
        <h3>{user.nickname}</h3>
        <p>id: {user.name}</p>
        <p>{user.explanation}</p>
      </div>
    );
    if (user.is_mypage === true) {
      return props.setContent(
        <Mypage setContent={props.setContent} />,
        "mypage"
      );
    }
    props.setContent(content, "default");
  };

  return (
    <div className="search">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          searchUser();
        }}
      >
        <input
          type="text"
          className="search__input"
          placeholder="...キーワードを入力"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        ></input>
        <div className="serach-results">
          {searchUserResults.map((user, index) => {
            console.log(user.icon);
            return (
              <div
                key={user.name}
                className="search-results__user"
                onClick={() => displyUser(index)}
              >
                <img
                  className="search-results__user-image"
                  src={
                    user.icon.url != null
                      ? baseURL + user.icon.thumb.url
                      : defaultIcon
                  }
                ></img>
                <p className="search-results__user-name">{user.name}</p>
                <p className="search-results__user-exp">{user.explanation}</p>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};
