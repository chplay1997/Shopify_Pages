import { Card, ChoiceList, Select, TextContainer } from '@shopify/polaris';
import { useCallback, useState } from 'react';

function VisibilityPage(props) {
    const [selected, setSelected] = useState('Default Page');

    const date = new Date();
    let currentDate = ` (as of ${date.toLocaleString()} GMT+${date.getTimezoneOffset() / -60})`;
    currentDate = currentDate.replace(
        currentDate.slice(currentDate.lastIndexOf(':'), currentDate.lastIndexOf(':') + 3),
        '',
    );

    const handleSelectChange = useCallback((value) => {
        setSelected(value);
    }, []);

    //Onchane radio button
    const handleChange = useCallback((value) => props.setSelected(value), []);
    return (
        <>
            <Card
                sectioned
                title="Visibility"
                footerActionAlignment="left"
                secondaryFooterActions={[
                    {
                        content: 'Set visibility date',
                        plain: true,
                        onAction: () => navigate('/'),
                    },
                ]}
            >
                <ChoiceList
                    choices={[
                        {
                            label: `Visible${props.selected[0] === 'Hidden' ? '' : currentDate}`,
                            value: `Visible`,
                        },
                        { label: 'Hidden', value: 'Hidden' },
                    ]}
                    selected={props.selected}
                    onChange={handleChange}
                />
            </Card>
            <Card sectioned title="Online store">
                <TextContainer>
                    <Select
                        label="Theme template"
                        options={[
                            { label: 'Default Page', value: 'Default Page' },
                            { label: 'Contact', value: 'Contact' },
                        ]}
                        onChange={handleSelectChange}
                        value={selected}
                    />
                    <p>Assign a template from your current theme to define how the page is displayed.</p>
                </TextContainer>
            </Card>
        </>
    );
}

export default VisibilityPage;
