import * as React from "react";
import Link from "next/link";
import Head from "../components/Head";
import Layout from "../components/Layout";
import Header from "../components/Header";
import styled from "react-emotion";
import { fetchAllTags, ITag, fetchViews, IView } from "../search/searchAPI";

import Router from "next/router";
import {
  createUpdateSearchQuery,
  UpdateSearchQueryAction
} from "../routerActions";
import { toArray } from "../util";

const Title = styled("h1")`
  text-align: center;
  font-size: 84px;
  color: rebeccapurple;
`;

interface PageProps {
  suggestedTags: ITag[];
  selectedTags: ITag[];
  views: IView[];
}

class Page extends React.Component<PageProps> {
  updateSearchQuery: UpdateSearchQueryAction;

  static async getInitialProps({ query }: any): Promise<PageProps> {
    const allTags = await fetchAllTags();

    const selectedTagIds = new Set<string>([
      ...toArray(query.dimension),
      ...toArray(query.topic)
    ]);

    const views = await fetchViews({
      dimension: toArray(query.dimension),
      topic: toArray(query.topic)
    });

    return {
      suggestedTags: allTags.filter(t => !selectedTagIds.has(t["@id"])),
      selectedTags: allTags.filter(t => selectedTagIds.has(t["@id"])),
      views
    };
  }

  constructor(props: any) {
    super(props);

    this.updateSearchQuery = createUpdateSearchQuery(Router);
  }

  render() {
    return (
      <Layout>
        <Head title="Home" />
        <Header
          suggestedTags={this.props.suggestedTags}
          selectedTags={this.props.selectedTags}
          updateSearchQuery={this.updateSearchQuery}
        />
        <h2>Matching Views</h2>
        <ul>{this.props.views.map(v => <li>{v.label}</li>)}</ul>
      </Layout>
    );
  }
}

export default Page;
