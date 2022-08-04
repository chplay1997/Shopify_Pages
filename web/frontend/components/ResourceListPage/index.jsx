import { Filters, Button, ResourceList, ResourceItem, TextStyle, ChoiceList, ButtonGroup } from '@shopify/polaris';
import { StarOutlineMinor } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { newPagesState } from '../../recoil';

import ButtonSort from '../ButtonSort';
import ModalConfirm from '../ModalConfirm';

function ResourceListPage() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [dataModal, setDataModal] = useState({});

    const [selected, setSelected] = useState(['hidden']);
    const [queryValue, setQueryValue] = useState('');

    const regex = /(<([^>]+)>)/gi;

    const pages = useRecoilValue(newPagesState);

    const handleTaggedWithChange = useCallback((value) => setSelected(value), []);
    const handleQueryValueChange = useCallback((value) => setQueryValue(value), []);
    const handleTaggedWithRemove = useCallback(() => setSelected(null), []);

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

    //Delete list pages
    const handleDeletePageCheckbox = () => {
        setDataModal({
            title: `Delete ${selectedItems.length} page?`,
            primaryAction: `Delete ${selectedItems.length} page`,
            secondaryActions: 'Cancel',
            content: `Deleted pages cannot be recovered. Do you still want to continue?`,
            id: selectedItems,
            type: 'home',
        });
        setActiveModal(true);
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
            onAction: handleDeletePageCheckbox,
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

    const filterControl = (
        <Filters
            queryPlaceholder="Filter Pages"
            queryValue={queryValue}
            filters={filters}
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
        <>
            <ResourceList
                resourceName={resourceName}
                items={pages}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                bulkActions={bulkActions}
                filterControl={filterControl}
            />
            <ModalConfirm
                active={activeModal}
                setActive={setActiveModal}
                dataModal={dataModal}
                setSelectedItems={setSelectedItems}
            />
        </>
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

        //Set up view time
        let viewTime;
        const currentDate = new Date();
        const pageUpdatedAt = new Date(updated_at);
        if (currentDate.getDay() - pageUpdatedAt.getDay() === 1) {
            viewTime = `Yesterday at ${pageUpdatedAt.toLocaleTimeString()}`;
        } else if (currentDate.getDay() - pageUpdatedAt.getDay() > 1) {
            viewTime = pageUpdatedAt.toLocaleString();
        } else {
            let time = Number.parseInt((new Date() - new Date(updated_at)) / 60000);
            viewTime = time < 2 ? 'Just now' : time < 60 ? time + ' minutes ago' : Math.floor(time / 60) + ' hour ago';
        }

        return (
            <ResourceItem id={id} url={`/${id}`} accessibilityLabel={`View details for ${title}`} name={title}>
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <div>{body_html.replace(regex, '')}</div>
                <div>{viewTime}</div>
            </ResourceItem>
        );
    }
}

export default ResourceListPage;
