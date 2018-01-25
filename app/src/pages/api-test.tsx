import * as React from "react";
import Link from "next/link";
import Head from "../components/Head";
import Layout from "../components/Layout";
import Header from "../components/Header";
import styled from "react-emotion";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { fetchAllTags, fetchTags, Tag, ITag } from "../search/searchAPI";

import Router from "next/router";
import {
  createUpdateSearchQuery,
  UpdateSearchQueryAction
} from "../routerActions";
import { toArray } from "../util";
import { Array } from "io-ts";

const Title = styled("h1")`
  text-align: center;
  font-size: 84px;
  color: rebeccapurple;
`;

interface PageProps {
  allTags: {
    data: ITag[];
    validation: string[];
  };
  queryTags: {
    data: ITag[];
    validation: string[];
  };
}

class Page extends React.Component<PageProps> {
  updateSearchQuery: UpdateSearchQueryAction;

  static async getInitialProps({ query }: any): Promise<PageProps> {
    const allTags = await fetchAllTags();
    const queryTags = await fetchTags("Hei");

    return {
      allTags: {
        data: allTags,
        validation: PathReporter.report(t.validate(allTags, t.array(Tag)))
      },
      queryTags: {
        data: queryTags,
        validation: PathReporter.report(t.validate(queryTags, t.array(Tag)))
      }
    };
  }

  constructor(props: any) {
    super(props);

    this.updateSearchQuery = createUpdateSearchQuery(Router);
  }

  render() {
    return (
      <Layout>
        <Head title="API Test Page" />
        <h2>All tags</h2>
        <ul>{this.props.allTags.validation.map(m => <li>{m}</li>)}</ul>
        <pre>{JSON.stringify(this.props.allTags.data, null, 2)}</pre>

        <h2>
          Tags with query <code>Hei</code>
        </h2>
        <ul>{this.props.queryTags.validation.map(m => <li>{m}</li>)}</ul>
        <pre>{JSON.stringify(this.props.queryTags.data, null, 2)}</pre>
      </Layout>
    );
  }
}

export default Page;
