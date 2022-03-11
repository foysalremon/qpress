import { atom } from 'recoil';

export const handleCategoryState = atom({
  key: 'handleCategoryState',
  default: false,
});

export const useSSRCategoriesState = atom({
  key: 'useSSRCategoriesState',
  default: true,
});
