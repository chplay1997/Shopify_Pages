import { useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormLayout, Labelled } from '@shopify/polaris';

import { useRecoilState } from 'recoil';
import { newContent } from '../../recoil';

function Editor() {
    const [content, setContent] = useRecoilState(newContent);
    const handleChangeContent = useCallback((newValue) => setContent(newValue), []);

    return (
        <FormLayout>
            <div style={{ marginTop: '32px', height: '200px' }}>
                <Labelled label="Content" />
                <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        handleChangeContent(data);
                    }}
                />
            </div>
        </FormLayout>
    );
}

export default Editor;
