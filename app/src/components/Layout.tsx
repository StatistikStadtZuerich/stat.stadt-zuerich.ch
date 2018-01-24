import * as React from "react";
import styled, { hydrate, injectGlobal } from "react-emotion";

declare global {
  interface Window {
    __NEXT_DATA__: any;
  }
}

// Only do once!
if (typeof window !== "undefined") {
  hydrate(window.__NEXT_DATA__.ids);
}

injectGlobal`
  * {
      box-sizing: border-box;
    }
  body {
    margin: 0;
`;

const Page = styled("div")`
  font-family: -apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Helvetica,sans-serif;}
  font-feature-settings: "kern" 1;¨
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default class extends React.Component {
  render() {
    return <Page>{this.props.children}</Page>;
  }
}
