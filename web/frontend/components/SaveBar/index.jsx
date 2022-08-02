function SaveBar(props) {
    return (
        <ContextualSaveBar
            fullWidth
            message="Unsaved changes"
            saveAction={{
                onAction: props.handleSubmitAddPage,
                loading: props.showLoading,
                disabled: false,
            }}
            discardAction={{
                onAction: () => console.log('add clear form logic'),
            }}
        />
    );
}

export default SaveBar;
