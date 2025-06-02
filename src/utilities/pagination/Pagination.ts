import * as _ from "lodash";
import { Model, Op, Sequelize } from "sequelize";
import { ModelType } from "../constants/Constants";

import { DB_TYPES, env } from "../../config";

export const uriParamToJson = <T extends Record<string, any>>(
  uri: string
): T => {
  const jsonData: any = {};

  const decodeWithType = (value: string): any => {
    const [actualValue, typeIndicator] = value.split(":");
    switch (typeIndicator) {
      case "b":
        return actualValue === "true";
      case "n":
        return parseFloat(actualValue);
      case "s":
      default:
        return actualValue;
    }
  };

  const decodeParam = (keys: string[], value: string) => {
    let current = jsonData;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = decodeWithType(value); // Decode and assign value at the final key
      } else {
        current = current[key] =
          current[key] || (isNaN(Number(keys[index + 1])) ? {} : []); // Create nested object or array
      }
    });
  };

  uri.split("&").forEach((param) => {
    const [encodedKey, encodedValue] = param.split("=");
    const key = decodeURIComponent(encodedKey);
    const value = decodeURIComponent(encodedValue);

    // Corrected: Removed unnecessary escape for ]
    const keys = key.replace(/]/g, "").split("["); // Split key into nested levels
    decodeParam(keys, value);
  });

  return jsonData as T;
};

function instanceOfFilterTypeArray(object: any): object is FilterType[] {
  return (
    Array.isArray(object) &&
    object.length > 0 &&
    typeof object[0].key === "string"
  );
}

function instanceOfStringArray(object: any): object is string[] {
  return object.length > 0 && typeof object[0] === "string";
}

export const FilterOperators = [
  "=",
  "!=",
  "ilike",
  "like",
  "between",
  ">",
  ">=",
  "<",
  "<=",
  "in",
  "notin",
  "or",
  "and",
];

export type FilterOperator =
  | "="
  | "!="
  | "ilike"
  | "like"
  | "between"
  | ">"
  | ">="
  | "<"
  | "<="
  | "in"
  | "notin"
  | "or"
  | "and";

export function mapOperator(operator: FilterOperator): symbol {
  switch (operator) {
    case "=":
      return Op.eq;
    case "!=":
      return Op.ne;
    case "like":
      return Op.like;
    case "ilike":
      return Op.iLike;
    case ">":
      return Op.gt;
    case ">=":
      return Op.gte;
    case "<":
      return Op.lt;
    case "<=":
      return Op.lte;
    case "in":
      return Op.in;
    case "notin":
      return Op.notIn;
    case "between":
      return Op.between;
    default:
      return Op.eq;
  }
}

export interface FilterType {
  key: string;
  operator: FilterOperator;
  value: string | string[] | FilterType[];
}

export interface SearchType {
  keys: string[];
  value: string;
}

export interface OrderType {
  key: string;
  value: "ASC" | "DESC";
  literal?: boolean;
}

export interface IncludeInputType {
  model: string;
  alias?: string;
  required?: boolean;
  separate?: boolean;
  filter?: FilterType[];
  include?: IncludeInputType[];
}

export interface IncludeType {
  model: typeof Model;
  as?: string;
  required?: boolean;
  where?: Record<string, any>;
  include?: IncludeType[];
  separate?: boolean;
}

function FilterSwitch(
  op: FilterOperator,
  value: string | string[] | FilterType[]
): any {
  switch (op) {
    case "=": {
      return { [Op.eq]: value };
    }
    case "!=": {
      return { [Op.ne]: value };
    }
    case "ilike": {
      return {
        [env.DB_TYPE === DB_TYPES.MYSQL ? Op.like : Op.iLike]: `%${value}%`,
      };
    }
    case "like": {
      return { [Op.like]: `%${value}%` };
    }
    case "between": {
      if (instanceOfStringArray(value)) {
        return {
          [Op.between]: value,
        };
      } else {
        return {};
      }
    }
    case "in": {
      if (instanceOfStringArray(value)) {
        return {
          [Op.in]: value,
        };
      } else {
        return {};
      }
    }
    case "notin": {
      if (instanceOfStringArray(value)) {
        return {
          [Op.notIn]: value,
        };
      } else {
        return {};
      }
    }
    case ">": {
      return { [Op.gt]: value };
    }
    case ">=": {
      return { [Op.gte]: value };
    }
    case "<": {
      return { [Op.lt]: value };
    }
    case "<=": {
      return { [Op.lte]: value };
    }
    case "and": {
      if (instanceOfFilterTypeArray(value)) {
        const val = value.map((filter) => {
          let _val: Record<string, any> = {};
          _val[filter.key] = FilterSwitch(filter.operator, filter.value);
          return _val;
        });
        return checkIfNotEmpty(val)
          ? {
            [Op.and]: val,
          }
          : {};
      } else {
        return {};
      }
    }
    case "or": {
      if (instanceOfFilterTypeArray(value)) {
        const val = value.map((filter) => {
          let _val: Record<string, any> = {};
          _val[filter.key] = FilterSwitch(filter.operator, filter.value);
          return _val;
        });
        return checkIfNotEmpty(val)
          ? {
            [Op.or]: val,
          }
          : {};
      } else {
        return {};
      }
    }
    default: {
      return {};
    }
  }
}

export function checkIfNotEmpty(value: any) {
  return (
    !_.isEmpty(value[Op.eq]) ||
    !_.isEmpty(value[Op.ne]) ||
    !_.isEmpty(value[Op.like]) ||
    !_.isEmpty(value[Op.iLike]) ||
    !_.isEmpty(value[Op.between]) ||
    !_.isEmpty(value[Op.in]) ||
    !_.isEmpty(value[Op.notIn]) ||
    !_.isEmpty(value[Op.gt]) ||
    !_.isEmpty(value[Op.gte]) ||
    !_.isEmpty(value[Op.lt]) ||
    !_.isEmpty(value[Op.lte]) ||
    !_.isEmpty(value[Op.or]) ||
    !_.isEmpty(value[Op.and]) ||
    !_.isEmpty(value)
  );
}

export function printObject(obj: Record<string, any>): void {
  const stack: { value: any; path: string }[] = [{ value: obj, path: "" }];

  while (stack.length > 0) {
    const { value, path } = stack.pop()!;
    console.log("=========================");
    console.log(value);
    console.log("=========================");
    try {
      if (Array.isArray(value)) {
        // Print array details
        console.log(`${path}: Array [${value.length} items]`);
        for (let i = 0; i < value.length; i++) {
          stack.push({ value: value[i], path: `${path}[${i}]` });
        }
      } else if (value && typeof value === "object") {
        if (value.constructor && value.constructor.name !== "Object") {
          // If it's a class instance, print its class name
          console.log(`${path}: class ${value.constructor.name}`);
        } else {
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              const newPath = path ? `${path}.${key}` : key;
              stack.push({ value: value[key], path: newPath });
            }
          }
        }
      } else {
        if (path.endsWith("model")) {
          console.log(`${path}: olla ${value.toString().split(" ")[1]}`);
        } else {
          console.log(`${path}: molla ${value}`);
        }
      }
    } catch (e) {
      console.log("Errrrorororor", e);
    }
  }
}

export function ParseFilters(
  queries: any,
  filters?: FilterType[]
): Record<string, any> {
  let filterQuery: Record<string, any> = {};
  if (filters && filters.length > 0) {
    filters.map((filter: FilterType) => {
      const val = FilterSwitch(filter.operator, filter.value);
      if (val && checkIfNotEmpty(val)) {
        if (filter.operator === "or" || filter.operator === "and") {
          filterQuery = Object.assign(queries["where"] ?? {}, val);
        } else {
          filterQuery[filter.key] = val;
        }
      }
    });
  }
  return filterQuery;
}

const QueryTypes = {
  F: "F", //F Filter
  I: "I", //I Include
  M: "M", //M Multiple
  O: "O", //O Order
  P: "P", //P Paranoid
  S: "S", //S Search
};

export const handleInclude = (includes: IncludeInputType[]): IncludeType[] => {
  if (includes.length > 0) {
    let _includes: IncludeType[] = [];
    includes.map((include: IncludeInputType) => {
      if (ModelType.get(include.model)) {
        const includeItem: IncludeType = {
          model: ModelType.get(include.model)!,
        };
        const filters = include.filter;
        let filterQuery: Record<string, any> = ParseFilters({}, filters);
        if (!_.isEmpty(filterQuery)) {
          includeItem.where = filterQuery;
        }

        if (include.alias) {
          includeItem.as = include.alias;
        }

        if (include.required !== null || include.required !== null) {
          includeItem.required = include.required;
        }

        if (include.separate !== null || include.separate !== null) {
          includeItem.separate = include.separate;
        }

        if (include.include) {
          includeItem.include = handleInclude(include.include);
        }

        _includes.push(includeItem);
      }
    });

    return _includes;
  }
  return [];
};

export type QueryParams = {
  offset?: number;
  limit?: number;
  filter?: FilterType[];
  search?: SearchType;
  order?: OrderType[];
  include?: IncludeInputType[];
  paranoid?: boolean;
};

function decodeQueryString(query: string): any {
  return uriParamToJson<QueryParams>(query);
}

export const ParseQuery = (
  query: any,
  types = ["F", "I", "M", "O", "P", "S"]
) => {
  query = decodeQueryString((query["query"] ?? "").toString());
  console.log(query);
  const parsedQuery: any = {
    query: types.includes(QueryTypes.M) ? { offset: 0, limit: 10 } : {},
  };
  if (types.includes(QueryTypes.P)) {
    parsedQuery.paranoid = true;
  }
  try {
    if (query) {
      const queries: Record<string, any> = {};
      for (let type of types) {
        switch (type) {
          case QueryTypes.F: {
            if (query["filter"]) {
              const filters: FilterType[] = query["filter"];
              let filterQuery: Record<string, any> = ParseFilters(
                queries,
                filters
              );
              if (filterQuery && checkIfNotEmpty(filterQuery)) {
                queries["where"] = filterQuery;
              }
            }
            break;
          }
          case QueryTypes.I: {
            if (query["include"]) {
              const includes = query["include"];
              const includeQuery: IncludeType[] = handleInclude(includes);
              if (includeQuery.length > 0) {
                queries["include"] = Object.assign(includeQuery);
              }
            }
            break;
          }
          case QueryTypes.M: {
            if (query["offset"]) {
              const _offset = parseInt(query["offset"]);
              let offset = isNaN(_offset) ? 0 : _offset;
              parsedQuery.query.offset = offset >= 0 ? offset : -offset;
            }
            if (query["limit"]) {
              const _limit = parseInt(query["limit"]);
              let limit = isNaN(_limit) ? 10 : _limit;
              let max_limit = 25000;
              parsedQuery.query.limit =
                limit >= 0 ? (limit > max_limit ? max_limit : limit) : 10;
              if (limit < 0) {
                parsedQuery.query.limit = 100000;
              }
            }
            break;
          }
          case QueryTypes.O: {
            if (query["order"]) {
              const orderItems: OrderType[] = query["order"];
              const orderQueryItems: [any, string][] = [];
              if (orderItems.length > 0) {
                orderItems.map((orderItem) => {
                  orderQueryItems.push([
                    orderItem.literal
                      ? Sequelize.literal(orderItem.key)
                      : orderItem.key,
                    orderItem.value,
                  ]);
                });
              }

              if (orderQueryItems.length > 0) {
                queries["order"] = Object.assign(orderQueryItems);
              }
            }
            break;
          }
          case QueryTypes.P: {
            if (query["paranoid"]) {
              parsedQuery.paranoid = !(query["paranoid"] === "true");
            }
            break;
          }

          case QueryTypes.S: {
            let mysql = env.DB_TYPE === DB_TYPES.MYSQL
            if (query["search"]) {
              const searchItem: SearchType = query["search"];
              const searchQueryItems: Record<string, any>[] = [];
              let literal = null;
              if (searchItem.keys.length > 0) {
                searchItem.keys.map((key: string) => {
                  const item: Record<string, any> = {};
                  if (key === "id") {
                    literal = Sequelize.where(
                      Sequelize.cast(Sequelize.col('id'), 'TEXT'),
                      { [mysql ? Op.like : Op.iLike]: `%${searchItem.value}%` }
                    )
                              
                  } else {
                    item[key] = {
                      [mysql
                        ? Op.like
                        : Op.iLike]: `%${searchItem.value}%`,
                    };
                  }
                  searchQueryItems.push(item);
                });
              }
              const searchQuery: Record<symbol, any> = {
                [Op.or]: literal ? [literal, ...searchQueryItems] : searchQueryItems,
              };

              if (searchQuery && !_.isEmpty(searchQuery[Op.or])) {
                if (queries["where"]) {
                  queries["where"] = {
                    [Op.and]: [queries["where"], searchQuery],
                  };
                } else {
                  queries["where"] = searchQuery;
                }
              }
            }
            break;
          }
        }
      }
      parsedQuery.query = Object.assign(parsedQuery.query, queries);
    }

    return parsedQuery;
  } catch (e) {
    console.log("error: ",e)
    return parsedQuery;
  }
};
