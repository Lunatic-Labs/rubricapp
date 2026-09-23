import * as SecureStore from 'expo-secure-store';

export const setItem = SecureStore.setItemAsync;
export const getItem = SecureStore.getItemAsync;
export const deleteItem = SecureStore.deleteItemAsync;
