import { Banner } from '@shopify/polaris';

function BannerAccess() {
    return (
        <Banner
            title="Store access is restricted"
            status="warning"
            action={{ content: 'See store password', url: '/preferences' }}
        >
            <p>While your online store is in development, only visitors with the password can access it.</p>
        </Banner>
    );
}

export default BannerAccess;
