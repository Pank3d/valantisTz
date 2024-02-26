import axios, { AxiosError, AxiosResponse } from "axios";
import { RequestData, RequestHeaders } from "../type/type";
import { md5 } from "js-md5";

export const generateHeaders = (password: string): RequestHeaders => {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const stringToHash = `${password}_${currentDate}`;
  const hash = md5(stringToHash);

  return {
    "X-Auth": hash,
  };
};

export const makeApiRequest = async (
  url: string,
  requestData: RequestData,
  headers: any,
  retryCount: number = 3
): Promise<any> => {
  try {
    console.log(url);
    const response: AxiosResponse<any> = await axios.post(url, requestData, {
      headers,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Произошла ошибка при выполнении запроса:", axiosError);
    if (axiosError.response?.data) {
      console.error("Идентификатор ошибки:", axiosError.response.data);
    }

    if (retryCount > 0) {
      console.log(`Повторный запрос. Осталось попыток: ${retryCount}`);
      return makeApiRequest(url, requestData, headers, retryCount - 1);
    } else {
      throw new Error("Произошла ошибка при выполнении запроса");
    }
  }
};


