// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import "../styles/mypage.css";
import { baseURL } from "./app";
import axios from "axios";
import Cookies from "js-cookie";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Tooltip from "@material-ui/core/Tooltip";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  makeStyles,
  Input,
} from "@material-ui/core";
import clsx from "clsx";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Profile } from "./profile";
import { refresh } from "../auth/refresh";

interface Props {
  setContent: (content: JSX.Element | null, name: string) => void;
}

interface User {
  name: string;
  nickname: string;
  explanation: string;
  icon: any;
  is_admin: boolean;
  is_mypage: boolean;
}

export const Mypage = (props: Props): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [display, displayLoginForm] = useState<boolean>(false);
  const [displayEmailError, setDsiplayEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [displayPasswordError, setDisplayPasswordError] = useState<boolean>(
    false
  );

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: "25ch",
    },
  }));

  const classes = useStyles();
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const displayMypage = (user: User) => {
    props.setContent(
      <Profile {...user} setContent={props.setContent} />,
      "mypage"
    );
  };

  const getMyData = async () => {
    const url = baseURL + "/api/v1/auth";
    return axios
      .get(url, { params: { token: Cookies.get("onetime") } })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          return displayMypage(response.data.body);
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
        displayLoginForm(true);
      });
  };

  const tryLogin = async () => {
    setDisplayPasswordError(false);
    setDsiplayEmailError(false);
    const url = baseURL + "/api/v1/auth";
    await axios
      .post(url, { value: { email: email, password: values.password } })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          Cookies.set("master", response.data.body.token.master);
          Cookies.set("onetime", response.data.body.token.onetime);
          getMyData();
        } else if (response.data.status === "FAILED") {
          if (response.data.body.message === "invalid email address") {
            setEmailError("無効なメールアドレスです");
            setDsiplayEmailError(true);
          }
          if (response.data.body.message === "invalid password") {
            setPasswordError("パスワードが違います");
            setDisplayPasswordError(true);
          }
        }
      });
  };

  if (display) {
    return (
      <div className="loginform">
        <div>
          <Tooltip
            title={emailError}
            open={displayEmailError}
            placement="right"
          >
            <FormControl className={(classes.margin, classes.textField)}>
              <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
              <Input
                id="input-with-icon-adornment"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </FormControl>
          </Tooltip>
        </div>
        <div>
          <Tooltip
            title={passwordError}
            open={displayPasswordError}
            placement="right"
          >
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />{" "}
            </FormControl>
          </Tooltip>
        </div>
        <p>
          <input
            className="loginform__submit"
            type="submit"
            onClick={tryLogin}
            value="ログイン"
          ></input>
        </p>
      </div>
    );
  } else {
    getMyData();
    return <div></div>;
  }
};
