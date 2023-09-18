<script setup>
import {
  useFirebaseApp,
  useAuth,
  useDatabase,
  useFirestore,
  useFirebaseStorage,
} from 'vuefire'

const firebaseApp = useFirebaseApp()
const auth = useAuth()
const database = useDatabase()
const firestore = useFirestore()
const storage = useFirebaseStorage()
</script>