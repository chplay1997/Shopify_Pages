import { Modal, TextContainer, Loading } from '@shopify/polaris';
import { useNavigate } from '@shopify/app-bridge-react';
import { useCallback, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { useAuthenticatedFetch } from '../../hooks';
import { newContent, newPagesState, newTitle } from '../../recoil';

function ModalConfirm(props) {
    const fetchAPI = useAuthenticatedFetch();
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const setPages = useSetRecoilState(newPagesState);
    const setTitle = useSetRecoilState(newTitle);
    const setContent = useSetRecoilState(newContent);

    const handleClose = useCallback(() => {
        props.setActive(false);
    }, []);

    const handleActions = () => {
        //Delete page
        if (props.dataModal?.hasOwnProperty('id')) {
            setIsLoading(true);
            const options = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            };
            fetchAPI(`/api/page/${props.dataModal.id}`, options)
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty('success')) {
                        //Action for home request
                        if (props.dataModal.type === 'home') {
                            setIsLoading(false);
                            props.setSelectedItems([]);
                            setPages((prev) => {
                                return prev.filter((page) => !props.dataModal.id.includes(page.id));
                            });
                            handleClose();
                        } else {
                            setContent('');
                            setTitle('');
                            navigate('/');
                        }
                    }
                })

                .catch((err) => console.log(err));
        } else if (props.dataModal?.hasOwnProperty('page')) {
            setContent(props.dataModal.page.body_html);
            setTitle(props.dataModal.page.title);
            handleClose();
        } else {
            navigate('/');
        }
    };

    return (
        <Modal
            activator={buttonRef}
            open={props.active}
            onClose={handleClose}
            title={props.dataModal.title}
            primaryAction={{
                content: props.dataModal.primaryAction,
                onAction: handleActions,
                destructive: true,
                loading: isLoading,
            }}
            secondaryActions={[
                {
                    content: props.dataModal.secondaryActions,
                    onAction: handleClose,
                },
            ]}
        >
            {isLoading && <Loading />}
            <Modal.Section>
                <TextContainer>
                    <p>{props.dataModal.content}</p>
                </TextContainer>
            </Modal.Section>
        </Modal>
    );
}

export default ModalConfirm;
