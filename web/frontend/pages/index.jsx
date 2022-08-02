import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Loading } from '@shopify/app-bridge-react';
import {
    Card,
    EmptyState,
    FooterHelp,
    Layout,
    Link,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    Spinner,
    Tabs,
    TextContainer,
} from '@shopify/polaris';

import { useAuthenticatedFetch } from '../hooks';
import ResourceListPage from '../components/ResourceListPage';
import BannerAccess from '../components/BannerAccess';

export default function HomePage() {
    const fetchAPI = useAuthenticatedFetch();
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(0);

    //Get all pages
    useEffect(() => {
        setIsLoading(true);
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        };
        fetchAPI('/api/pages', options)
            .then((res) => res.json())
            .then((data) => {
                setIsLoading(false);
                setPages(data);
                console.log(data);
            })
            .catch((err) => console.log(err));
    }, []);

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
        <SkeletonPage fullWidth>
            <Layout>
                <Layout.Section>
                    {/* <SkeletonTabs /> */}
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </Card>
                    <Card sectioned>
                        <Spinner center accessibilityLabel="Spinner example" size="large" />
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    ) : null;

    /* Use Polaris Card and EmptyState components to define the contents of the empty state */
    const emptyPagesMarkup =
        !isLoading && !pages?.length ? (
            <Card sectioned>
                <EmptyState
                    heading="Add pages to your online store"
                    action={{
                        content: 'Add page',
                        onAction: () => navigate('/new'),
                    }}
                    image="https://cdn.shopify.com/shopifycloud/online-store-web/assets/8001a44e37248e13f435f27aac113bf41ef8c7b78c5a460e9c77137b887b37c0.svg"
                >
                    <p>
                        Write clear page titles and descriptions to improve your search engine optimization (SEO) and
                        help customers find your website.
                    </p>
                </EmptyState>
            </Card>
        ) : null;

    const pagesMarkup = pages?.length ? (
        <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <ResourceListPage pages={pages} />
            </Tabs>
        </Card>
    ) : null;

    return (
        <Page
            fullWidth={pages.length || isLoading ? true : false}
            title="Pages"
            primaryAction={{
                content: 'Add page',
                onAction: () => navigate('/new'),
            }}
        >
            <Layout>
                <Layout.Section>{!isLoading && <BannerAccess />}</Layout.Section>

                <Layout.Section>
                    {loadingMarkup}
                    {emptyPagesMarkup}
                    {pagesMarkup}
                </Layout.Section>
            </Layout>
            {!isLoading && (
                <FooterHelp>
                    Learn more about{' '}
                    <Link
                        url="https://help.shopify.com/en/manual/sell-online/online-store/pages?st_source=admin&amp;st_campaign=pages_footer&amp;utm_source=admin&amp;utm_campaign=pages_footer"
                        external
                    >
                        pages
                    </Link>
                </FooterHelp>
            )}
        </Page>
    );
}
