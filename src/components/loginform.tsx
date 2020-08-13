import {
  Tooltip,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { baseURL } from "../auth/baseURL";
import axios from "axios";
import Cookies from "js-cookie";
import clsx from "clsx";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export const LoginForm = (props: { setMode: (v: Mode) => void }) => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
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
          props.setMode("TryLogIn");
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
  return (
    <div className="loginform">
      <div>
        <Tooltip title={emailError} open={displayEmailError} placement="right">
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
        <input
          className="loginform__submit"
          type="submit"
          onClick={() => props.setMode("CreateUser")}
          value="アカウント作成"
        ></input>
      </p>
    </div>
  );
};
