import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDJ5gbKl1Og9NLgaHvIXdMuR4sNa3EJBws",
  authDomain: "vue-todo-ce321.firebaseapp.com",
  projectId: "vue-todo-ce321",
  storageBucket: "vue-todo-ce321.appspot.com",
  messagingSenderId: "127220610534",
  appId: "1:127220610534:web:223dd3c92407e82a10d227",
  measurementId: "G-5HDG8DDD2L"
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const todosRef = collection(db, 'todos')