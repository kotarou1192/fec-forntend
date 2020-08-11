import axios from "axios";
import { baseURL } from "../components/app";
import Cookies from "js-cookie";
import { refresh } from "./refresh";

export const logout = async () => {
  const url = baseURL + "/api/v1/auth";
  await axios
    .delete(url, { params: { token: Cookies.get("onetime") } })
    .then((response) => {
      if (
        response.data.status === "FAILED" ||
        response.data.status === "OLD_TOKEN"
      ) {
        refresh().then((status) => {
          if (status === "SUCCESS") return logout();
          Cookies.remove("onetime");
          Cookies.remove("master");
          return;
        });
        return;
      } else if (response.data.status === "SUCCESS") {
        Cookies.remove("onetime");
        Cookies.remove("master");
        return;
      }
    });
};
