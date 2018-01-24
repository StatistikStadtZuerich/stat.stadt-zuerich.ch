import * as React from "react";
import Downshift from "downshift";
import styled, { keyframes } from "react-emotion";
import { withRouter, SingletonRouter } from "next/router";

import { fetchTags, ITag } from "./searchAPI";
import { toArray } from "../util";

import { blue } from "../theme/colors";
import { UpdateSearchQueryAction } from "../routerActions";

const Input = styled("input")`
  font-size: 16px;
  line-height: 24px;
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
`;

const InputGroup = styled("div")`
  display: flex;
  background: #84b8db;
  border-radius: 5px;
  padding: 5px;
`;

const SelectedTags = styled("div")`
  display: flex;
`;

const Tag = styled("div")`
  background: white;
  color: ${blue};
  margin-right: 2px;
  font-size: 12px;
  padding: 5px 2px;
  border-radius: 3px;
`;

const Menu = styled("div")`
  position: absolute;
  top: 40px;
  background: white;
  box-shadow: 1px 0 0 rgba(0, 0, 0, 0.3);
`;

const MenuItem = styled("div")`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  color: ${blue};
`;

const SearchFieldWrapper = styled("div")`
  position: relative;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingLabel = styled("div")`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 20px;
  color: white;
  animation: ${spin} 500ms infinite linear;
`;

export interface SearchFieldProps {
  selectedItems: ITag[];
  items: ITag[];
  onChange: ((input: { query: string; tags: ITag[] }) => void);
  loading: boolean;
}

export const SearchField = ({
  selectedItems,
  items,
  onChange,
  loading
}: SearchFieldProps) => (
  <Downshift
    id="search"
    onInputValueChange={query => onChange({ query, tags: selectedItems })}
    render={props => (
      <div>
        <SearchFieldWrapper>
          <InputGroup>
            <SelectedTags>
              {selectedItems &&
                selectedItems.map(item => (
                  <Tag key={item["@id"]}>{item.label}</Tag>
                ))}
            </SelectedTags>
            <Input
              {...props.getInputProps({
                placeholder: "Type something",
                id: "search-input"
              })}
            />
          </InputGroup>
          {loading ? <LoadingLabel>😀</LoadingLabel> : null}
          {props.isOpen ? (
            <Menu>
              {items.map(item => (
                <MenuItem key={item["@id"]}>
                  {item["@type"]}: {item.label}
                </MenuItem>
              ))}
            </Menu>
          ) : null}
        </SearchFieldWrapper>
      </div>
    )}
  />
);

const TagList = styled("ul")`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TagListItem = styled("li")`
  display: inline-block;
  margin-right: 3px;
`;

const SelectableTag = styled("button")``;

export const TagSuggestions = ({
  tags,
  updateSearchQuery
}: {
  tags: ITag[];
  updateSearchQuery: UpdateSearchQueryAction;
}) => {
  return (
    <TagList>
      {tags.map(t => (
        <TagListItem key={t["@id"]}>
          <SelectableTag
            onClick={() => {
              updateSearchQuery({ [t["@type"].toLocaleLowerCase()]: t["@id"] });
            }}
          >
            {t.label}
          </SelectableTag>
        </TagListItem>
      ))}
    </TagList>
  );
};

export interface SearchControllerProps {
  suggestedTags: ITag[];
  selectedTags: ITag[];
  updateSearchQuery: UpdateSearchQueryAction;
}

export interface SearchControllerState {
  selectedItems: ITag[];
  items: ITag[];
  loading: boolean;
}

export class SearchController extends React.Component<
  SearchControllerProps,
  SearchControllerState
> {
  state: SearchControllerState = {
    selectedItems: [],
    items: [],
    loading: false
  };

  handleChange = (input: { query: string; tags: any[] }) =>
    this.fetchItems(input.query);

  fetchItems = async (query: string) => {
    this.setState({ loading: true });
    const tags = await fetchTags(query);
    this.setState({ items: tags, loading: false });
  };

  render() {
    return (
      <div>
        <SearchField
          selectedItems={this.props.selectedTags}
          items={this.state.items}
          loading={this.state.loading}
          onChange={this.handleChange}
        />
        Dimensions
        <TagSuggestions
          tags={this.props.suggestedTags.filter(
            t => t["@type"] === "Dimension"
          )}
          updateSearchQuery={this.props.updateSearchQuery}
        />
        Topics
        <TagSuggestions
          tags={this.props.suggestedTags.filter(t => t["@type"] === "Topic")}
          updateSearchQuery={this.props.updateSearchQuery}
        />
      </div>
    );
  }
}
