import { Layout, Page, Loading, SkeletonBodyText, Card, Frame } from '@shopify/polaris';

function SkeletonSinglePage() {
    return (
        <Frame>
            <Page>
                <Loading />
                <Layout>
                    <Layout.Section>
                        <Card sectioned title="">
                            <SkeletonBodyText />
                        </Card>
                        <Card title="Product">
                            <Card.Section>
                                <SkeletonBodyText lines={1} />
                            </Card.Section>
                            <Card.Section>
                                <SkeletonBodyText lines={3} />
                            </Card.Section>
                        </Card>
                        <Card sectioned title="">
                            <SkeletonBodyText lines={2} />
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card sectioned title="" />
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
}

export default SkeletonSinglePage;
