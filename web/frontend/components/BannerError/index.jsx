import { Banner, List } from '@shopify/polaris';

function BannerError(props) {
    return (
        <Banner title={`There is ${props.errorMessage.length} error`} status="critical">
            <List type="bullet">
                {props.errorMessage.map((message, index) => (
                    <List.Item key={index}>
                        {message[0].substring(0, 1).toLocaleUpperCase() +
                            message[0].substring(1, message[0].length) +
                            ' ' +
                            message[1][0]}
                    </List.Item>
                ))}
            </List>
        </Banner>
    );
}

export default BannerError;
