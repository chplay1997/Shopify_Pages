import { useCallback, useState } from 'react';
import {
    Card,
    Page,
    Layout,
    TextContainer,
    TextField,
    FormLayout,
    ChoiceList,
    Select,
    PageActions,
} from '@shopify/polaris';

import Editor from '../components/Editor';

export default function PageName() {
    const [selected, setSelected] = useState(['Hidden']);

    const handleChange = useCallback((value) => setSelected(value), []);
    return (
        <Page breadcrumbs={[{ content: 'Settings', url: '/' }]} title="Add page">
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <FormLayout>
                            <FormLayout>
                                <TextField
                                    label="Title"
                                    placeholder="e.g. Contact us, Sizing chart, FAQs"
                                    onChange={() => {}}
                                    autoComplete="off"
                                />
                            </FormLayout>

                            <FormLayout>
                                <Editor />
                            </FormLayout>
                        </FormLayout>
                    </Card>

                    <Card
                        sectioned
                        title="Search engine listing preview"
                        /* This button will take the user to a Create a QR code page */
                        actions={[{ content: 'Edit website SEO', onAction: () => navigate('/qrcodes/new') }]}
                    >
                        <p>Add a title and description to see how this Page might appear in a search engine listing</p>
                    </Card>
                </Layout.Section>

                <Layout.Section secondary>
                    <Card
                        sectioned
                        title="Visibility"
                        footerActionAlignment="left"
                        secondaryFooterActions={[
                            {
                                content: 'Set visibility date',
                                plain: true,
                                onAction: () => navigate('/qrcodes/new'),
                            },
                        ]}
                    >
                        <ChoiceList
                            choices={[
                                {
                                    label: 'Visible (as of 7/29/2022, 4:25 PM GMT+7)',
                                    value: 'Visible (as of 7/29/2022, 4:25 PM GMT+7)',
                                },
                                { label: 'Hidden', value: 'Hidden' },
                            ]}
                            selected={selected}
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
                                // onChange={handleSelectChange}
                                value={'Default Page'}
                            />
                            <p>Assign a template from your current theme to define how the page is displayed.</p>
                        </TextContainer>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <PageActions
                        secondaryActions={[
                            {
                                content: 'Cancel',
                            },
                        ]}
                        primaryAction={[
                            {
                                content: 'Save',
                                disabled: true,
                            },
                        ]}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );
}
