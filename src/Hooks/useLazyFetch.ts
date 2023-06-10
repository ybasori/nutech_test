import { useCallback, useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";

const methods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
};
interface Props {
  url: string;
  method?: keyof typeof methods;
  credentials?: string;
  authorization?: string;
}

const useLazyFetch = <ResultType>({
  url,
  method = "GET",
  credentials,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResultType>();
  const [arrData] = useState<{ key: string; value: string }[]>();
  const [error, setError] = useState<AxiosResponse>();

  const onAction = useCallback(
    (
      body: unknown = {},
      cb?: (success?: AxiosResponse, error?: AxiosResponse) => void
    ) => {
      setLoading(true);
      let bodyData: unknown = null;
      if (body instanceof Object) {
        const formd = new FormData();
        for (const key in body) {
          const keyName = key as keyof typeof body;
          if (body[keyName] instanceof File) {
            formd.append(
              keyName,
              body[keyName] as unknown as File,
              body[keyName].name
            );
          } else {
            formd.append(keyName, body[keyName] as unknown as string);
          }
        }
        bodyData = formd;
      } else {
        bodyData = body;
      }
      const newUrl = url;
      let headers: {
        "Content-Type"?: string;
        Authorization?: string;
      } = {};
      if (!(bodyData instanceof FormData)) {
        headers = { ...headers, "Content-Type": "application/json" };
      }
      axios({
        url: `http://localhost:8000${newUrl}`,
        method,
        headers,
        ...(method === "GET" ? { params: bodyData } : { data: bodyData }),
        ...(credentials ? { credentials } : {}),
      })
        .then((res: AxiosResponse) => {
          setLoading(false);
          if (cb) {
            setData(res.data as ResultType);
            cb && cb(res, undefined);
          } else {
            if (res?.data?.redirectUrl) {
              window.location.replace(res?.data?.redirectUrl);
            }
          }
        })
        .catch((err: AxiosError) => {
          setError(err.response);
          setLoading(false);
          cb && cb(undefined, err.response);
        });
    },
    [credentials, method, url]
  );

  return [onAction, { loading, data, arrData, error }] as const;
};

export default useLazyFetch;
