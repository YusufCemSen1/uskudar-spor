import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCOvfKIaPvNhS6xnDcfa9gB7pXAlVMwS6Y',
  authDomain: 'uskudar-spor.firebaseapp.com',
  projectId: 'uskudar-spor',
  storageBucket: 'uskudar-spor.firebasestorage.app',
  messagingSenderId: '1573922737',
  appId: '1:1573922737:web:892016036a0cfb0897ff90',
  measurementId: 'G-C69RD48PEF',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
