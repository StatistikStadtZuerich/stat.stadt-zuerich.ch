import { SingletonRouter } from "next/router";
import { toArray } from "./util";

export interface SearchQuery {
  dimension?: string | string[];
  topic?: string | string[];
  // location: string | string[],
  // time: string | string[], // or from/to?
}

export type UpdateSearchQueryAction = (q: SearchQuery) => void;

const mergeValues = (
  v1: string | string[] | void,
  v2: string | string[] | void
): string[] => {
  return Array.from(new Set(toArray(v1).concat(toArray(v2))));
};

const mergeQuery = (query: SearchQuery, newQuery: SearchQuery): SearchQuery => {
  let mergedQuery = { ...query };

  Object.keys(newQuery).forEach(k => {
    switch (k) {
      // Merge-able values
      case "dimension":
      case "topic":
        mergedQuery[k] = mergeValues(mergedQuery[k], newQuery[k]);
        break;
      default:
        // Replace all other keys
        break;
    }
  });

  return mergedQuery;
};

export const createUpdateSearchQuery = (
  router: SingletonRouter
): UpdateSearchQueryAction => newQuery => {
  router.push({
    pathname: "/",
    query: mergeQuery(router.query === undefined ? {} : router.query, newQuery)
    // shallow: true // <- use this to avoid re-mounting the page e.g. for page transitions. getInitialProps() will not be called, so make sure to load necessary data, see https://github.com/zeit/next.js/#shallow-routing
  });
};

// TODO: action to remove tags from search query
