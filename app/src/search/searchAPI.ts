import "isomorphic-unfetch";
import * as qs from "querystring";
import * as t from "io-ts";

import { toArray } from "../util";

export const Tag = t.interface({
  "@id": t.string,
  "@type": t.union([t.literal("Dimension"), t.literal("Topic")]),
  label: t.string
});

export type ITag = t.TypeOf<typeof Tag>;

export const View = t.interface({
  "@id": t.string,
  label: t.string
});

export type IView = t.TypeOf<typeof View>;

interface APIResult<T> {
  "@id"?: string;
  "@type"?: "Collection";
  member?: T[];
  // If empty result
  "@graph"?: never[];
}

export const fetchTags = (query: string): Promise<ITag[]> => {
  if (query === "") {
    return Promise.resolve([]);
  }

  return fetch(
    `http://stat.stadt-zuerich.ch/api/tags/?query=${encodeURIComponent(
      query
    )}&format=json`
  )
    .then(r => r.json())
    .then((result: APIResult<ITag>) => {
      return toArray(result.member);
    });
};

export const fetchAllTags = (): Promise<ITag[]> => {
  return fetch(`http://stat.stadt-zuerich.ch/api/tags/?format=json`)
    .then(r => r.json())
    .then((result: APIResult<ITag>) => {
      return toArray(result.member);
    });
};

export const fetchAllViews = (): Promise<IView[]> => {
  return fetch(`http://stat.stadt-zuerich.ch/api/views/?format=json`)
    .then(r => r.json())
    .then((result: APIResult<IView>) => {
      return toArray(result.member);
    });
};

interface IViewsParams {
  dimension?: string[];
  topic?: string[];
  time?: any;
  location?: any;
}

export const fetchViews = (params: IViewsParams): Promise<IView[]> => {
  return fetch(
    `http://stat.stadt-zuerich.ch/api/views/?${qs.stringify({
      ...params,
      format: "json"
    })}`
  )
    .then(r => r.json())
    .then((result: APIResult<IView>) => {
      return toArray(result.member);
    });
};
