import { useNavigate } from '@shopify/app-bridge-react';
import { Modal, TextContainer } from '@shopify/polaris';
import { useCallback, useRef } from 'react';

function ModalConfirm(props) {
    const navigate = useNavigate();
    const buttonRef = useRef(null);

    const handleClose = useCallback(() => {
        props.setActive(false);
    }, []);

    const handleLeavePage = useCallback(() => {
        navigate('/');
    }, []);

    return (
        <Modal
            activator={buttonRef}
            open={props.active}
            onClose={handleClose}
            title={props.dataModal.title}
            primaryAction={{
                content: props.dataModal.primaryAction,
                onAction: handleLeavePage,
                destructive: true,
            }}
            secondaryActions={[
                {
                    content: props.dataModal.secondaryActions,
                    onAction: handleClose,
                },
            ]}
        >
            <Modal.Section>
                <TextContainer>
                    <p>{props.dataModal.content}</p>
                </TextContainer>
            </Modal.Section>
        </Modal>
    );
}

export default ModalConfirm;
