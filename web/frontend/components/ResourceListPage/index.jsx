import { Filters, Button, ResourceList, ResourceItem, TextStyle, ChoiceList, ButtonGroup } from '@shopify/polaris';
import { StarOutlineMinor } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import { useAuthenticatedFetch } from '../../hooks';

import ButtonSort from '../ButtonSort';

function ResourceListPage(props) {
    const fetchAPI = useAuthenticatedFetch();
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState('');
    const [selected, setSelected] = useState(['hidden']);
    const [popoverActive, setPopoverActive] = useState(true);

    const regex = /(<([^>]+)>)/gi;

    const [pages, setPages] = useState(props.pages);

    const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);
    const activator = <Button onClick={togglePopoverActive}>Sales channels</Button>;

    const handleTaggedWithChange = useCallback((value) => setTaggedWith(value), []);
    const handleQueryValueChange = useCallback((value) => setQueryValue(value), []);
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);

    const handleQueryValueRemove = useCallback(() => {
        setQueryValue('');
    }, []);

    const handleClearAll = useCallback(() => {
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);

    const resourceName = {
        singular: 'page',
        plural: 'pages',
    };

    const bulkActions = [
        {
            content: 'Make selected pages visible',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Hide selected pages',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        },
        {
            content: 'Delete pages',
            destructive: true,
            onAction: () => console.log('Todo: implement bulk delete'),
        },
    ];

    const filters = [
        {
            key: 'taggedWith3',
            label: 'Visibility',
            filter: (
                <ChoiceList
                    title="Visibility"
                    titleHidden
                    choices={[
                        { label: 'Visible', value: 'Visible' },
                        { label: 'Hidden', value: 'Hidden' },
                    ]}
                    selected={selected}
                    onChange={handleTaggedWithChange}
                    onClearAll={handleClearAll}
                />
            ),
            shortcut: true,
        },
    ];

    const appliedFilters = !isEmpty(taggedWith)
        ? [
              {
                  key: 'taggedWith3',
                  label: disambiguateLabel('taggedWith3', taggedWith),
                  onRemove: handleTaggedWithRemove,
              },
          ]
        : [];

    const filterControl = (
        <Filters
            queryPlaceholder="Filter Pages"
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={handleQueryValueChange}
            onQueryClear={handleQueryValueRemove}
            // onClearAll={handleClearAll}
        >
            <div style={{ paddingLeft: '8px' }}>
                <ButtonGroup>
                    <Button disabled icon={StarOutlineMinor}>
                        Saved
                    </Button>

                    <ButtonSort />
                </ButtonGroup>
            </div>
        </Filters>
    );

    return (
        <ResourceList
            resourceName={resourceName}
            items={pages}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            bulkActions={bulkActions}
            sortValue={sortValue}
            sortOptions={[
                { label: 'Newest update', value: 'DATE_MODIFIED_DESC' },
                { label: 'Oldest update', value: 'DATE_MODIFIED_ASC' },
            ]}
            onSortChange={(selected) => {
                setSortValue(selected);
                console.log(`Sort option changed to ${selected}.`);
            }}
            filterControl={filterControl}
        />
    );

    //Render pages
    function renderItem(item) {
        if (pages.length === 0) {
            return (
                <ResourceItem>
                    <h3>
                        <TextStyle variation="strong">{'Empty'}</TextStyle>
                    </h3>
                </ResourceItem>
            );
        }
        const { id, title, body_html, updated_at } = item;
        let time = Number.parseInt((new Date() - new Date(updated_at)) / 60000);
        let viewTime = time < 1 ? 'Just now' : time + ' minutes ago';
        return (
            <ResourceItem id={id} accessibilityLabel={`View details for ${title}`} name={title}>
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <div>{body_html.replace(regex, '')}</div>
                <div>{viewTime}</div>
            </ResourceItem>
        );
    }

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'taggedWith3':
                return `Visibility is ${value}`;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
}

export default ResourceListPage;
