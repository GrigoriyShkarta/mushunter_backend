import firebase from 'firebase/compat';
import initializeApp = firebase.initializeApp;
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAXJmfmjNOgFfJ0lmIEyFmAPSGTZKL2XfQ',
	authDomain: 'mushunter-11a47.firebaseapp.com',
	projectId: 'mushunter-11a47',
	storageBucket: 'mushunter-11a47.appspot.com',
	messagingSenderId: '904087062857',
	appId: '1:904087062857:web:54325812de69c709f63298',
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
