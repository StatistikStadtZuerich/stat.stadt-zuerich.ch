import React from "react";
import ReactDOM from "react-dom";
import { Catalog, pageLoader } from "catalog";

const pages = [
  {
    path: "/",
    title: "Welcome",
    content: pageLoader("./WELCOME.md")
  },
  {
    path: "/components/search",
    title: "Search",
    content: require("../lib/search/Search.docs.js") // NOTE: dynamic imports currently get messed up by the next/babel preset in .baberc, so don't use pageLoader(() => import('...')) for now!
  }
];

ReactDOM.render(
  <Catalog title="Catalog" pages={pages} />,
  document.getElementById("catalog")
);
