import { Button, Popover, ActionList, ChoiceList } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { SortMinor } from '@shopify/polaris-icons';
import { useSetRecoilState } from 'recoil';
import { newPagesState } from '../../recoil';

function ButtonSort() {
    const [popoverActive, setPopoverActive] = useState(false);
    const [sortValue, setSortValue] = useState(['Newest update']);
    const setPages = useSetRecoilState(newPagesState);

    // console.log(pages);

    const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

    const handleChange = useCallback((value) => {
        setSortValue(value);
        sortPages(value);
    }, []);

    //Sort the list
    const sortPages = (type) => {
        setPages((prev) => {
            switch (type.toString()) {
                case 'Newest update':
                    return [...prev].sort((a, b) => b.updated_at.localeCompare(a.updated_at));

                case 'Oldest update':
                    return [...prev].sort((a, b) => a.updated_at.localeCompare(b.updated_at));

                case 'Title A–Z':
                    return [...prev].sort((a, b) => a.title.localeCompare(b.title));

                case 'Title Z–A':
                    return [...prev].sort((a, b) => b.title.localeCompare(a.title));

                default:
                    return prev;
            }
        });
    };

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
                selected={sortValue}
                onChange={handleChange}
            />
        </Popover>
    );
}

export default ButtonSort;
