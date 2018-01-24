export const toArray = <T extends {}>(x: T | T[] | void): T[] =>
  x === undefined ? [] : Array.isArray(x) ? x : [x];
