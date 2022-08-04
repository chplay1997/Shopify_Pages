import { useNavigate } from '@shopify/app-bridge-react';
import { Card, EmptyState, Page } from '@shopify/polaris';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Page>
            <Card>
                <Card.Section>
                    <EmptyState
                        action={{
                            content: 'Go to Pages',
                            onClick: () => {
                                navigate('/');
                            },
                        }}
                        heading="The Page you're looking for couldn't be found"
                    >
                        <p>Check the web address and try again, or try navigating to the Page from Pages.</p>
                    </EmptyState>
                </Card.Section>
            </Card>
        </Page>
    );
}
