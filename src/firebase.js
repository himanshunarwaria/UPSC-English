import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAXesjnVRA-UJvBEgKI9D2r53Q5badrQZU',
  authDomain: 'upsc-english.firebaseapp.com',
  projectId: 'upsc-english',
  storageBucket: 'upsc-english.firebasestorage.app',
  messagingSenderId: '766808088509',
  appId: '1:766808088509:web:d0c3845a653ff55e413cd4',
  measurementId: 'G-99GMXSXNSY',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
