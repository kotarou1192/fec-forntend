import axios from "axios";
import { baseURL } from "./baseURL";
import Cookies from "js-cookie";

// 成功したらワンタイムをクッキーにセット
// 失敗したらマスターをクッキーから削除
export const refresh = async (): Promise<"SUCCESS" | "ERROR" | "FAILED"> => {
  const url = baseURL + "/api/v1/auth";
  Cookies.remove("onetime");
  return await axios
    .put(url, { token: { master: Cookies.get("master") } })
    .then((response) => {
      if (
        response.data.status === "FAILED" ||
        response.data.status === "OLD_TOKEN"
      ) {
        Cookies.remove("master");
        return "FAILED";
      } else if (response.data.status === "SUCCESS") {
        console.log(response.data.body.token);
        const onetime_token = response.data.body.token.onetime;
        Cookies.set("onetime", onetime_token);
        return "SUCCESS";
      }
      return "ERROR";
    })
    .catch((e) => {
      console.error(e);
      return "ERROR";
    });
};
