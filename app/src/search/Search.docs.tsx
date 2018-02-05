import {markdown, ReactSpecimen} from 'catalog';

import {SearchField} from './Search';
export default () => markdown`

## Search Field

${<ReactSpecimen>
  <SearchField
    items={[]}
    selectedItems={[]}
    onChange={() => {}}
    loading={false}
  />
</ReactSpecimen>}

${<ReactSpecimen>
  <SearchField
    items={[{label: 'Foo', '@id': 'foo', '@type': 'Dimension'}]}
    selectedItems={[]}
    onChange={() => {}}
    loading={false}
  />
</ReactSpecimen>}

${<ReactSpecimen>
  <SearchField
    items={[]}
    selectedItems={[{label: 'Foo', '@id': 'foo', '@type': 'Dimension'}]}
    onChange={() => {}}
    loading={false}
  />
</ReactSpecimen>}

`