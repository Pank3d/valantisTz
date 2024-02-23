import axios from "axios";
import crypto from "crypto";

const password = "Valantis";
const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const stringToHash = `${password}_${currentDate}`;

const md5sum = crypto.createHash("md5");
md5sum.update(stringToHash);
const hash = md5sum.digest("hex");
const url = "http://api.valantis.store:40000/";

console.log(url)

const headers = {
  "X-Auth": hash,
};

const requestData = {
  action: "get_items",
  params: { offset: 10, limit: 3 },
};


axios
  .post(url, requestData, { headers })
  .then((response) => {
    console.log("Ответ от сервера:", response.data);
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });
