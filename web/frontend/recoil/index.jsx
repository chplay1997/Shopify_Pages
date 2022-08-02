import { atom, selector } from 'recoil';

//Title add page
const titleState = atom({
    key: 'title',
    default: '',
});

export const newTitle = selector({
    key: 'newTitle',
    get: ({ get }) => {
        return get(titleState);
    },
    set: ({ set }, newValue) => {
        set(titleState, newValue);
    },
});

//Content add page
const contentState = atom({
    key: 'content',
    default: '',
});

export const newContent = selector({
    key: 'newContent',
    get: ({ get }) => {
        return get(contentState);
    },
    set: ({ set }, newValue) => {
        set(contentState, newValue);
    },
});

//Message error
const messageErrorState = atom({
    key: 'error',
    default: [],
});

export const newMessageError = selector({
    key: 'messageErrorState',
    get: ({ get }) => {
        return get(messageErrorState);
    },
    set: ({ set }, newValue) => {
        set(messageErrorState, newValue);
    },
});

//Page title seo add page
const pageTittleState = atom({
    key: 'pageTittle',
    default: '',
});

export const newPageTittle = selector({
    key: 'newPageTittle',
    get: ({ get }) => {
        return get(pageTittleState);
    },
    set: ({ set }, newValue) => {
        set(pageTittleState, newValue);
    },
});

//description seo add page
const descriptionState = atom({
    key: 'description',
    default: '',
});

export const newDescription = selector({
    key: 'newDescription',
    get: ({ get }) => {
        return get(descriptionState);
    },
    set: ({ set }, newValue) => {
        set(descriptionState, newValue);
    },
});

//url seo add page
const urlState = atom({
    key: 'url',
    default: '',
});

export const newUrl = selector({
    key: 'newUrl',
    get: ({ get }) => {
        return get(urlState);
    },
    set: ({ set }, newValue) => {
        set(urlState, newValue);
    },
});
