/* eslint-disable @typescript-eslint/no-explicit-any */
const useHelper = () => {
  const onArrayForm: (
    name: string,
    data: any,
    obj: { label: string; value: any }[]
  ) => { label: string; value: any }[] = (name, data, obj) => {
    let newObj = [...obj];
    for (const key in data) {
      if (
        (Array.isArray(data[key]) || typeof data[key] === "object") &&
        !(data[key] instanceof File)
      ) {
        newObj = onArrayForm(`${name}[${key}]`, data[key], newObj);
      } else {
        newObj = [...newObj, { label: `${name}[${key}]`, value: data[key] }];
      }
    }
    return newObj;
  };

  const expandJSON: (data: any[]) => { label: string; value: any }[] = (
    data
  ) => {
    let obj: { label: string; value: any }[] = [];
    for (const key in data) {
      if (
        Array.isArray(data[key]) ||
        (typeof data[key] === "object" && !(data[key] instanceof File))
      ) {
        obj = onArrayForm(`${key}`, data[key], obj);
      } else {
        obj = [
          ...obj,
          {
            label: key,
            value: data[key],
          },
        ];
      }
    }
    return obj;
  };

  return { expandJSON };
};

export default useHelper;
