import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseAuthorConfig, firebaseReaderConfig } from "./firebaseConfigs";


const authorApp = initializeApp(firebaseAuthorConfig, "authorApp");
export const authorAuth = initializeAuth(authorApp, {
  persistence: browserLocalPersistence,
});
export const authorDB = getFirestore(authorApp);


const readerApp = initializeApp(firebaseReaderConfig, "readerApp");
export const readerAuth = initializeAuth(readerApp, {
  persistence: browserLocalPersistence,
});
export const readerDB = getFirestore(readerApp);
