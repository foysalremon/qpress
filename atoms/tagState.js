import { atom } from 'recoil';

export const handleTagsState = atom({
  key: 'handleTagsState',
  default: false,
});

export const useSSRTagsState = atom({
  key: 'useSSRTagsState',
  default: true,
});
