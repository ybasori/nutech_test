import React from "react";
import ReactDom from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import "./global.scss";
import "bulma/css/bulma.min.css";
import Home from "./Pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

// const root = ReactDom.createRoot(document.getElementById("root") as HTMLElement);
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//     <RouterProvider router={router} />
//   </Provider>
//   </React.StrictMode>
// );

ReactDom.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
  document.querySelector("#root")
);
