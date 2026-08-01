import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDysF-hpdysPvNKlnqdUougfpCjZBn_bf8",
  authDomain: "vloozmovie.firebaseapp.com",
  projectId: "vloozmovie",
  storageBucket: "vloozmovie.firebasestorage.app",
  messagingSenderId: "920214028156",
  appId: "1:920214028156:web:52bc620ef5a5f77eee6ef9",
  measurementId: "G-YFKYGQEBB6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const resetUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    let deletedCount = 0;
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      // Keep admin emails
      if (userData.email === 'dewantomaulana14@gmail.com' || userData.email === 'user@aetheric.cinema') {
        console.log(`Skipping admin user: ${userData.email}`);
        continue;
      }
      
      console.log(`Deleting user: ${userData.email} (ID: ${userDoc.id})`);
      await deleteDoc(doc(db, 'users', userDoc.id));
      deletedCount++;
    }
    
    console.log(`\nSuccessfully deleted ${deletedCount} non-admin users from Firebase.`);
    process.exit(0);
  } catch (error) {
    console.error("Error resetting users:", error);
    process.exit(1);
  }
};

resetUsers();
