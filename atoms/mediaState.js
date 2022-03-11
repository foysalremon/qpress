import { atom } from 'recoil';

export const handleMediaState = atom({
  key: 'handleMediaState',
  default: false,
});

export const useSSRMediasState = atom({
  key: 'useSSRMediasState',
  default: true,
});
