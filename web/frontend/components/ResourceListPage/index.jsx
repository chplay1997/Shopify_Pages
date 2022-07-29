import {
    Filters,
    Button,
    ResourceList,
    Avatar,
    ResourceItem,
    TextStyle,
    ChoiceList,
    ButtonGroup,
} from '@shopify/polaris';
import { StarOutlineMinor } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import ButtonSort from '../ButtonSort';

function ResourceListPage() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState(null);
    const [selected, setSelected] = useState(['hidden']);
    const [popoverActive, setPopoverActive] = useState(true);

    const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);
    const activator = <Button onClick={togglePopoverActive}>Sales channels</Button>;

    const handleTaggedWithChange = useCallback((value) => setTaggedWith(value), []);
    const handleQueryValueChange = useCallback((value) => setQueryValue(value), []);
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [handleQueryValueRemove, handleTaggedWithRemove]);

    const resourceName = {
        singular: 'page',
        plural: 'pages',
    };

    const items = [
        {
            id: 112,
            url: 'customers/341',
            name: 'Mae Jemison',
            location: 'Decatur, USA',
            latestOrderUrl: 'orders/1456',
        },
        {
            id: 212,
            url: 'customers/256',
            name: 'Ellen Ochoa',
            location: 'Los Angeles, USA',
            latestOrderUrl: 'orders/1457',
        },
    ];

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
            // key: 'taggedWith3',
            // label: 'Tagged with',
            // filter: (
            //     <TextField
            //         label="Tagged with"
            //         value={taggedWith}
            //         onChange={handleTaggedWithChange}
            //         autoComplete="off"
            //         labelHidden
            //     />
            // ),
            // shortcut: true,

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
            onClearAll={handleClearAll}
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
            items={items}
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

    function renderItem(item) {
        const { id, url, name, location, latestOrderUrl } = item;
        const media = <Avatar customer size="medium" name={name} />;
        const shortcutActions = latestOrderUrl
            ? [
                  {
                      content: 'View page',
                      accessibilityLabel: `View ${name}’s latest order`,
                      url: latestOrderUrl,
                  },
              ]
            : null;
        return (
            <ResourceItem
                id={id}
                url={url}
                media={media}
                accessibilityLabel={`View details for ${name}`}
                shortcutActions={shortcutActions}
                // persistActions
            >
                <h3>
                    <TextStyle variation="strong">{name}</TextStyle>
                </h3>
                <div>{location}</div>
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
