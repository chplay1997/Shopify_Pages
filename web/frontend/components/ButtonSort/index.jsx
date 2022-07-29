import { Button, Popover, ActionList, ChoiceList } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { SortMinor } from '@shopify/polaris-icons';

function ButtonSort() {
    const [popoverActive, setPopoverActive] = useState(true);
    const [selected, setSelected] = useState(['Newest update']);

    const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

    const handleChange = useCallback((value) => setSelected(value), []);

    const activator = (
        <Button icon={SortMinor} onClick={togglePopoverActive}>
            Sort
        </Button>
    );

    return (
        <Popover
            active={popoverActive}
            activator={activator}
            onClose={togglePopoverActive}
            ariaHaspopup={false}
            sectioned
        >
            <ChoiceList
                title="Sort By"
                choices={[
                    { label: 'Newest update', value: 'Newest update' },
                    { label: 'Oldest update', value: 'Oldest update' },
                    { label: 'Title A–Z', value: 'Title A–Z' },
                    { label: 'Title Z–A', value: 'Title Z–A' },
                ]}
                selected={selected}
                onChange={handleChange}
            />
            {/* <Popover.Pane fixed>
                <Popover.Section>
                    <p>Available sales channels</p>
                </Popover.Section>
            </Popover.Pane>
            <Popover.Pane>
                <ActionList
                    actionRole="menuitem"
                    items={[{ content: 'Online store' }, { content: 'Facebook' }, { content: 'Shopify POS' }]}
                />
            </Popover.Pane> */}
        </Popover>
    );
}

export default ButtonSort;
