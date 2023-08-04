/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { RootState } from "../Redux/store";
import { useSelector } from "react-redux";
import useHelper from "./useHelper";

const methods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};
interface Props {
  url: string;
  method?: keyof typeof methods;
}

const useLazyFetch = <ResultType>({ url, method = "GET" }: Props) => {
  const { expandJSON } = useHelper();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResultType>();
  const [error, setError] = useState<AxiosResponse>();
  const userState = useSelector((state: RootState) => state.user);

  const onAction = useCallback(
    (
      {
        path = "",
        body = {},
      }: {
        body?: any;
        path?: string;
      },
      cb?: (success?: AxiosResponse, error?: AxiosResponse) => void
    ) => {
      const source = axios.CancelToken.source();
      setLoading(true);
      setData(undefined);
      let bodyData: unknown = null;
      const formd = new FormData();
      const bd = expandJSON(body);
      for (const key in bd) {
        formd.append(bd[key].label, bd[key].value);
      }
      bodyData = formd;
      const newUrl = url;
      let headers: {
        "Content-Type"?: string;
        Authorization?: string;
      } = {};

      if (userState.token) {
        headers = { ...headers, Authorization: `Bearer ${userState.token}` };
      }
      axios({
        url: `${newUrl}${path}`,
        method,
        cancelToken: source.token,
        headers: { ...headers },
        ...(method === "GET" ? { params: bodyData } : { data: bodyData }),
      })
        .then((res: AxiosResponse) => {
          setLoading(false);
          setData(res.data as ResultType);
          if (cb) {
            cb && cb(res, undefined);
          }
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          cb && cb(undefined, err.response);
        });

      return () => {
        source.cancel("Cancelling in cleanup");
      };
    },
    [method, url, userState.token, expandJSON]
  );

  return [onAction, { loading, data, error }] as const;
};

export default useLazyFetch;
