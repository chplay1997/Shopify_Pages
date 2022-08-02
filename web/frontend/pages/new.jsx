import { useState } from 'react';
import { useNavigate } from '@shopify/app-bridge-react';
import { Card, Page, Layout, FormLayout, PageActions, Frame, Loading, ContextualSaveBar } from '@shopify/polaris';

import { useRecoilState } from 'recoil';
import { newMessageError, newContent, newTitle } from '../recoil';

import { useAuthenticatedFetch } from '../hooks';
import ModalConfirm from '../components/ModalConfirm';
import BannerError from '../components/BannerError';
import Editor from '../components/Editor';
import VisibilityPage from '../components/VisibilityPage';
import SearchPreview from '../components/SarchPreview';
import InputTitle from '../components/InputTitle';

export default function PageName() {
    const navigate = useNavigate();
    const fetchAPI = useAuthenticatedFetch();
    const [selected, setSelected] = useState(['Hidden']);

    const [showLoading, setShowLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [dataModal, setDataModal] = useState({});

    //Recoil state
    const [title, setTitle] = useRecoilState(newTitle);
    const [content, setContent] = useRecoilState(newContent);
    const [errorMessage, setErrorMessage] = useRecoilState(newMessageError);

    const logoFrame = {
        width: 124,
        contextualSaveBarSource:
            'https://cdn.shopify.com/shopifycloud/web/assets/v1/f5416ec27e17f00a67f8c2d6603088baa6635c7bc2071b4f6533c8d260fc8644.svg',
    };

    //Submit add page
    const handleSubmitAddPage = () => {
        setShowLoading(true);
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ title, content }),
        };
        fetchAPI('/api/page', options)
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty('success')) {
                    setContent('');
                    setTitle('');
                } else {
                    setErrorMessage(Object.entries(data.response.body.errors));
                }
                setShowLoading(false);
            })

            .catch((err) => console.log(err));
    };

    //Handle cancel add page
    const handleCancel = (type) => {
        if (title || content) {
            if (type === 'cancel') {
                setDataModal({
                    title: 'You have unsaved changes',
                    primaryAction: 'Leave page',
                    secondaryActions: 'Cancel',
                    content: 'If you leave this page, all unsaved changes will be lost.',
                });
            } else if (type === 'discard') {
                setDataModal({
                    title: 'Discard all unsaved changes',
                    primaryAction: 'Discard changes',
                    secondaryActions: 'Continue editing',
                    content: 'If you discard changes, you’ll delete any edits you made since you last saved.',
                });
            }
            setActiveModal(true);
        } else {
            navigate('/');
        }
    };

    return (
        <Frame logo={logoFrame}>
            {/* Modal confirm cancel */}
            <ModalConfirm active={activeModal} setActive={setActiveModal} dataModal={dataModal} />

            <ContextualSaveBar
                fullWidth
                message="Unsaved changes"
                saveAction={{
                    onAction: handleSubmitAddPage,
                    loading: showLoading,
                    disabled: content || title ? false : true,
                }}
                discardAction={{
                    onAction: () => handleCancel('discard'),
                }}
            />

            {showLoading && <Loading />}

            <Page breadcrumbs={[{ content: 'Settings', url: '/' }]} title="Add page">
                <Layout>
                    {/* Show message error */}
                    {errorMessage.length > 0 && (
                        <Layout.Section>
                            <BannerError errorMessage={errorMessage} />
                        </Layout.Section>
                    )}

                    <Layout.Section>
                        <Card sectioned>
                            <FormLayout>
                                <InputTitle />
                                <Editor />
                            </FormLayout>
                        </Card>

                        {/* Search preview */}
                        <SearchPreview />
                    </Layout.Section>

                    <Layout.Section secondary>
                        <VisibilityPage selected={selected} setSelected={setSelected} />
                    </Layout.Section>

                    <Layout.Section>
                        <PageActions
                            secondaryActions={[
                                {
                                    content: 'Cancel',
                                    onClick: () => handleCancel('cancel'),
                                },
                                // {
                                //     destructive: true,
                                //     outline: true,
                                //     content: 'Delete page',
                                //     onClick: handleDeletePage,
                                // },
                            ]}
                            primaryAction={[
                                {
                                    content: 'Save',
                                    disabled: content || title ? false : true,
                                    onClick: handleSubmitAddPage,
                                },
                            ]}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
}
