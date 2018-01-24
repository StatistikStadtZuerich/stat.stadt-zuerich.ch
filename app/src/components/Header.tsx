import * as React from "react";
import styled from "react-emotion";
import Link from "next/link";

import { blue } from "../theme/colors";
import Logo from "./Logo";
import { SearchController } from "../search/Search";
import { ITag } from "../search/searchAPI";
import { UpdateSearchQueryAction } from "../routerActions";

const Header = styled("header")`
  color: white;
  background-color: ${blue};
  padding: 30px;
  display: flex;
  justify-content: space-between;
`;

const LogoContainer = styled("div")`
  min-width: 160px;
  margin-right: 20px;
`;

const Nav = styled.nav`
  flex-align: flex-end;
  min-width: 160px;
  margin-left: 20px;
`;

const LinkList = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: 0;
`;

const NavLink = styled.li`
  padding: 6px 8px;
  list-style: none;
`;

const NavLinkAnchor = styled.a`
  font-size: 12px;
  color: white;
  text-decoration: none;
  display: block;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Navigation = () => (
  <Nav>
    <LinkList>
      <NavLink>
        <Link prefetch href="/">
          <NavLinkAnchor>Home</NavLinkAnchor>
        </Link>
      </NavLink>
      <NavLink>
        <Link prefetch href="/api-test">
          <NavLinkAnchor>API Test Page</NavLinkAnchor>
        </Link>
      </NavLink>
    </LinkList>
  </Nav>
);

export default ({
  suggestedTags,
  selectedTags,
  updateSearchQuery
}: {
  suggestedTags: ITag[];
  selectedTags: ITag[];
  updateSearchQuery: UpdateSearchQueryAction;
}) => (
  <Header>
    <LogoContainer>
      <Logo />
    </LogoContainer>
    <SearchController
      suggestedTags={suggestedTags}
      selectedTags={selectedTags}
      updateSearchQuery={updateSearchQuery}
    />
    <Navigation />
  </Header>
);
