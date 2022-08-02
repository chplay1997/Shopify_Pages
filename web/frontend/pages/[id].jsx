import { useParams } from 'react-router-dom';
import {
    Card,
    Page,
    Layout,
    SkeletonBodyText,
    FormLayout,
    PageActions,
    Frame,
    ContextualSaveBar,
} from '@shopify/polaris';
import { ViewMinor, DuplicateMinor } from '@shopify/polaris-icons';
import { Loading, TitleBar } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from '../hooks';
import { useEffect, useState } from 'react';

import { useNavigate } from '@shopify/app-bridge-react';

import { useRecoilState } from 'recoil';
import { newMessageError, newContent, newTitle } from '../recoil';

import ModalConfirm from '../components/ModalConfirm';
import BannerError from '../components/BannerError';
import Editor from '../components/Editor';
import VisibilityPage from '../components/VisibilityPage';
import SearchPreview from '../components/SarchPreview';
import InputTitle from '../components/InputTitle';

export default function QRCodeEdit() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const fetchAPI = useAuthenticatedFetch();

    const navigate = useNavigate();
    const [selected, setSelected] = useState(['Hidden']);

    const [showLoading, setShowLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [dataModal, setDataModal] = useState({});

    //Recoil state
    const [title, setTitle] = useRecoilState(newTitle);
    const [content, setContent] = useRecoilState(newContent);
    const [errorMessage, setErrorMessage] = useRecoilState(newMessageError);

    useEffect(() => {
        setIsLoading(true);
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        };
        fetchAPI(`/api/page/${id}`, options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.hasOwnProperty('success')) {
                    // setContent('');
                    // setTitle('');
                } else {
                    // setErrorMessage(Object.entries(data.response.body.errors));
                }
                setIsLoading(false);
            })

            .catch((err) => console.log(err));
    }, [id]);

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

    //Handle delete page
    const handleDeletePage = (type) => {
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

    /* Loading action and markup that uses App Bridge and Polaris components */
    if (isLoading) {
        return (
            <Page>
                <Loading />
                <Layout>
                    <Layout.Section>
                        <Card sectioned title="Title">
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
                        <Card sectioned title="Discount">
                            <SkeletonBodyText lines={2} />
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card sectioned title="QR code" />
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return (
        <Frame logo={logoFrame}>
            {/* Modal confirm cancel */}

            <ModalConfirm active={activeModal} setActive={setActiveModal} dataModal={dataModal} />
            {/* <ContextualSaveBar
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
                /> */}

            {showLoading && <Loading />}

            <Page
                breadcrumbs={[{ content: 'Settings', url: '/' }]}
                title="page 10"
                secondaryActions={[
                    { content: 'Duplicate', icon: DuplicateMinor },
                    { content: 'View page', icon: ViewMinor },
                ]}
                pagination={{
                    hasPrevious: true,
                    hasNext: false,
                }}
            >
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
                                    destructive: true,
                                    outline: true,
                                    content: 'Delete page',
                                    onClick: handleDeletePage,
                                },
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
