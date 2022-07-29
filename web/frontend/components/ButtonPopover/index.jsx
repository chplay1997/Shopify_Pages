import { Button, Popover, ActionList } from '@shopify/polaris';
import { useState, useCallback } from 'react';

function ButtonPopover(props) {
    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            More actions
        </Button>
    );

    return (
        <div style={{ height: '250px' }}>
            <Popover
                active={popoverActive}
                activator={activator}
                autofocusTarget="first-node"
                onClose={togglePopoverActive}
            >
                <ActionList actionRole="menuitem" items={props.content} />
            </Popover>
        </div>
    );
}

export default ButtonPopover;
