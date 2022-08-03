import { FormLayout, TextField } from '@shopify/polaris';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { newTitle, newMessageError } from '../../recoil';

function InputTitle(props) {
    const [title, setTitle] = useRecoilState(newTitle);
    const [errorMessage, setErrorMessage] = useRecoilState(newMessageError);

    const handleChangeTitle = useCallback((newValue) => {
        setTitle(newValue);
        setErrorMessage([]);
    }, []);
    return (
        <FormLayout>
            <TextField
                label="Title"
                placeholder="e.g. Contact us, Sizing chart, FAQs"
                value={title}
                onChange={handleChangeTitle}
                autoComplete="off"
                {...(errorMessage?.length > 0 &&
                    errorMessage[0].includes('title') && { error: "Title can't be blank" })}
            />
        </FormLayout>
    );
}

export default InputTitle;
