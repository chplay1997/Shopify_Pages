import { useCallback, useState } from 'react';
import { useNavigate, Loading } from '@shopify/app-bridge-react';
import { Banner, Card, EmptyState, FooterHelp, Layout, Link, Page, SkeletonBodyText, Tabs } from '@shopify/polaris';

import ResourceListPage from '../components/ResourceListPage';

export default function HomePage() {
    /*
    Add an App Bridge useNavigate hook to set up the navigate function.
    This function modifies the top-level browser URL so that you can
    navigate within the embedded app and keep the browser in sync on reload.
  */
    const navigate = useNavigate();

    /*
    These are mock values. Setting these values lets you preview the loading markup and the empty state.
  */
    const isLoading = false;
    const isRefetching = false;
    const QRCodes = [1];

    /* Card */
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), []);

    const tabs = [
        {
            id: 'all-customers-1',
            content: 'All',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
        },
        {
            id: 'search-customers-1',
            content: 'Custom search',
            panelID: 'search-customers-content-1',
        },
    ];

    /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
    const loadingMarkup = isLoading ? (
        <Card sectioned>
            <Loading />
            <SkeletonBodyText />
        </Card>
    ) : null;

    /* Use Polaris Card and EmptyState components to define the contents of the empty state */
    const emptyStateMarkup =
        isLoading && !QRCodes?.length ? (
            <Card sectioned>
                <EmptyState
                    heading="Create unique QR codes for your product"
                    /* This button will take the user to a Create a QR code page */
                    action={{
                        content: 'Create QR code',
                        onAction: () => navigate('/qrcodes/new'),
                    }}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                    <p>Allow customers to scan codes and buy products using their phones.</p>
                </EmptyState>
            </Card>
        ) : null;

    /*
    Use Polaris Page and TitleBar components to create the page layout,
    and include the empty state contents set above.
  */
    return (
        <Page
            fullWidth
            title="Pages"
            primaryAction={{
                content: 'Add Pages',
                onAction: () => navigate('/new'),
            }}
        >
            <Layout>
                <Layout.Section>
                    <Banner
                        title="Store access is restricted"
                        status="warning"
                        action={{ content: 'See store password', url: '/preferences' }}
                    >
                        <p>While your online store is in development, only visitors with the password can access it.</p>
                    </Banner>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                            <ResourceListPage />
                        </Tabs>
                    </Card>
                </Layout.Section>
            </Layout>
            <FooterHelp>
                Learn more about{' '}
                <Link
                    url="https://help.shopify.com/en/manual/sell-online/online-store/pages?st_source=admin&amp;st_campaign=pages_footer&amp;utm_source=admin&amp;utm_campaign=pages_footer"
                    external
                >
                    pages
                </Link>
            </FooterHelp>
        </Page>
    );
}
