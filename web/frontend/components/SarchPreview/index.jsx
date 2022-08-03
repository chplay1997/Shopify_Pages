import { Card, FormLayout, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { newContent, newTitle, newPageTittle, newDescription, newUrl } from '../../recoil';

function SearchPreview() {
    const title = useRecoilValue(newTitle);
    const content = useRecoilValue(newContent);

    const [pageTittle, setPageTittle] = useRecoilState(newPageTittle);
    const [description, setDescription] = useRecoilState(newDescription);
    const [url, setUrl] = useRecoilState(newUrl);

    const [showChange, setShowChange] = useState(false);

    //Regex for delete tag html
    const regex = /(<([^>]+)>)/gi;
    const uri = 'https://damhv.myshopify.com/admin/apps/page-6/';

    //handle focus description
    const handleFocusDescription = () => {
        if (description == title) {
            setDescription('');
        }
    };

    //handle blur description
    const handleBlurDescription = () => {
        if (!description) {
            setDescription(content);
        }
    };

    //handle focus description
    const handleFocusUrl = () => {
        if (!url) {
            setUrl(title);
        }
    };

    //handle set value page title
    const handleSetPageTitle = useCallback((value) => {
        console.log(window.location.hostname);
        setPageTittle(value);
    }, []);

    //handle set value page description
    const handleSetDescription = useCallback((value) => {
        setDescription(value);
    }, []);

    //handle set value Url
    const handleSetUrl = useCallback((value) => {
        setUrl(value);
    }, []);

    //View page appear in a search
    const pageAppear = () => {
        if (title && content) {
            return (
                <Card.Section>
                    <p style={{ color: '#1a0dab' }}>{pageTittle || title}</p>
                    <p style={{ color: '#006621' }}>{uri + title}</p>
                    <p style={{ color: '#545454' }}>{description.replace(regex, '') || content.replace(regex, '')}</p>
                </Card.Section>
            );
        } else if (title && !content) {
            return (
                <Card.Section>
                    Add a description to see how this Page might appear in a search engine listing
                </Card.Section>
            );
        } else {
            return (
                <Card.Section>
                    Add a title and description to see how this Page might appear in a search engine listing
                </Card.Section>
            );
        }
    };

    return (
        <Card
            title="Search engine listing preview"
            actions={[
                {
                    content: showChange ? '' : 'Edit website SEO',
                    disabled: showChange,
                    onAction: () => setShowChange(true),
                },
            ]}
        >
            {pageAppear()}

            {showChange && (
                <Card.Section>
                    <FormLayout>
                        <TextField
                            label="Page title"
                            placeholder={title}
                            value={pageTittle}
                            onChange={handleSetPageTitle}
                            helpText={`${pageTittle.length} of 70 characters used`}
                        />
                        <TextField
                            label="Description"
                            placeholder={content}
                            value={description}
                            multiline={4}
                            onChange={handleSetDescription}
                            onFocus={handleFocusDescription}
                            onBlur={handleBlurDescription}
                            helpText={`${description.length} of 320 characters used`}
                        />
                        <TextField
                            label="URL and handle"
                            prefix={uri}
                            placeholder={title.replaceAll(' ', '-')}
                            value={url}
                            onChange={handleSetUrl}
                            onFocus={handleFocusUrl}
                        />
                    </FormLayout>
                </Card.Section>
            )}
        </Card>
    );
}

export default SearchPreview;
