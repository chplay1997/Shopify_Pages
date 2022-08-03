import { useParams } from 'react-router-dom';
import { Card, Page, Layout, FormLayout, PageActions, Frame, ContextualSaveBar, Banner, Link } from '@shopify/polaris';
import { ViewMinor, DuplicateMinor } from '@shopify/polaris-icons';
import { Loading } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from '../hooks';
import { useEffect, useState } from 'react';

import { useNavigate } from '@shopify/app-bridge-react';

import { useRecoilState } from 'recoil';
import { newMessageError, newContent, newTitle, newPageTittle, newDescription, newUrl } from '../recoil';

import ModalConfirm from '../components/ModalConfirm';
import BannerError from '../components/BannerError';
import Editor from '../components/Editor';
import VisibilityPage from '../components/VisibilityPage';
import SearchPreview from '../components/SarchPreview';
import InputTitle from '../components/InputTitle';
import SkeletonSinglePage from '../components/SkeletonSinglePage';

export default function QRCodeEdit() {
    const { id } = useParams();
    const fetchAPI = useAuthenticatedFetch();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState('');
    const [showSaveBar, setShowSaveBar] = useState(false);

    const navigate = useNavigate();
    const [selected, setSelected] = useState(['Hidden']);

    const [showLoading, setShowLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [dataModal, setDataModal] = useState({});

    //Recoil state
    const [title, setTitle] = useRecoilState(newTitle);
    const [content, setContent] = useRecoilState(newContent);
    const [errorMessage, setErrorMessage] = useRecoilState(newMessageError);

    const [pageTittle, setPageTittle] = useRecoilState(newPageTittle);
    const [description, setDescription] = useRecoilState(newDescription);
    const [url, setUrl] = useRecoilState(newUrl);

    //Listen for changes input value and show save bar
    useEffect(() => {
        if (!page) {
            return;
        }
        if (title != page.title || content != page.body_html || description || pageTittle || url != page.handle) {
            setShowSaveBar(true);
        } else {
            setShowSaveBar(false);
        }

        return () => {
            setShowSaveBar(false);
        };
    }, [title, content, pageTittle, description, url]);

    //Get data
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
                setPage(data);

                setTitle(data.title);
                setContent(data.body_html);
                // setPageTittle(data.title);
                // setDescription(data.body_html);
                setUrl(data.handle);

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
    const handleUpdatePage = () => {
        setShowLoading(true);

        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ title, content }),
        };
        fetchAPI(`/api/page/${page.id}`, options)
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty('success')) {
                    setPage((prev) => ({ ...prev, title: title, body_htm: content }));
                    setShowSaveBar(false);
                } else {
                    console.log(data);
                    setErrorMessage([['id', [data.response.body.errors]]]);
                }
                setShowLoading(false);
            })

            .catch((err) => console.log(err));
    };

    //Handle delete page
    const handleDeletePage = () => {
        setDataModal({
            title: `Delete ${page.title}?`,
            primaryAction: 'Delete',
            secondaryActions: 'Cancel',
            content: `Delete “${page.title}”? This can\'t be undone.`,
            id: [page.id],
        });
        setActiveModal(true);
    };

    //Handle discardChange
    const handleDiscard = () => {
        setDataModal({
            title: 'Discard all unsaved changes',
            primaryAction: 'Discard changes',
            secondaryActions: 'Continue editing',
            content: 'If you discard changes, you’ll delete any edits you made since you last saved.',
            page: page,
        });
        setActiveModal(true);
    };

    /* Loading action and markup that uses App Bridge and Polaris components */
    if (isLoading) {
        return <SkeletonSinglePage />;
    }

    return (
        <Frame logo={logoFrame}>
            {/* Modal confirm cancel */}

            <ModalConfirm active={activeModal} setActive={setActiveModal} dataModal={dataModal} />

            {showSaveBar && (
                <ContextualSaveBar
                    message="Unsaved changes"
                    saveAction={{
                        onAction: handleUpdatePage,
                        loading: showLoading,
                    }}
                    discardAction={{
                        onAction: handleDiscard,
                    }}
                />
            )}

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

                    {/* Use it for features */}
                    {/* <Layout.Section>
                        <Banner title={`${page.title} created`} status="success">
                            <p>
                                <Link url="#" external>
                                    {' View on your online store'}
                                </Link>
                                {`, `}
                                <Link onClick={() => navigate('/new')}>create another page</Link> {` or `}
                                <Link url="#"> add it to your store’s navigation.</Link>
                            </p>
                        </Banner>
                    </Layout.Section> */}

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
                                    disabled: !showSaveBar,
                                    onClick: handleUpdatePage,
                                },
                            ]}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
}
