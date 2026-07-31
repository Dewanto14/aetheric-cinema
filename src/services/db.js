import { db, isFirebaseConfigured } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs, getCountFromServer, addDoc, orderBy } from 'firebase/firestore';

// Fallback logic uses localStorage if Firebase is not configured

const getCurrentUserId = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      return userObj.id || userObj.email || 'local_user';
    } catch(e) {}
  }
  return null;
};

export const getTotalUserCount = async () => {
  if (isFirebaseConfigured()) {
    try {
      const coll = collection(db, 'users');
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (e) {
      console.error("Failed to get user count", e);
      return 0;
    }
  }
  // Fallback if no firebase, just return 0 to pass
  return 0;
};

export const submitContactMessage = async (name, email, message) => {
  if (isFirebaseConfigured()) {
    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
        read: false
      });
      return true;
    } catch (e) {
      console.error("Failed to submit message", e);
      return false;
    }
  }
  // Simulated success for non-firebase environments
  return true;
};

export const getContactMessages = async () => {
  if (isFirebaseConfigured()) {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const messages = [];
      snapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      return messages;
    } catch (e) {
      console.error("Failed to get messages", e);
      return [];
    }
  }
  return [];
};

// WATCHLIST APIS
export const getWatchlist = async () => {
  const userId = getCurrentUserId();
  if (!userId) return [];
  
  if (isFirebaseConfigured() && userId !== 'local_user') {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data().watchlist || [];
      }
      return [];
    } catch (e) {
      console.error("Firebase fetch error", e);
    }
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(`watchlist_${userId}`);
    return local ? JSON.parse(local) : [];
  } catch (e) {
    return [];
  }
};

export const addToWatchlist = async (movie) => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  
  const { id, ...rest } = movie;
  const payload = { ...rest, movieId: id, userId, id: Date.now() };
  
  if (isFirebaseConfigured() && userId !== 'local_user') {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        watchlist: arrayUnion(payload)
      }, { merge: true });
    } catch (e) {
      console.error("Firebase update error", e);
    }
  }

  // Fallback to localStorage always so UI is instant
  const list = await getWatchlist();
  if (!list.find(item => String(item.movieId) === String(id))) {
    list.push(payload);
    localStorage.setItem(`watchlist_${userId}`, JSON.stringify(list));
  }
  return payload;
};

export const removeFromWatchlist = async (movieId) => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  
  if (isFirebaseConfigured() && userId !== 'local_user') {
    try {
      const list = await getWatchlist();
      const itemToRemove = list.find(item => String(item.movieId) === String(movieId));
      if (itemToRemove) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          watchlist: arrayRemove(itemToRemove)
        });
      }
    } catch (e) {
      console.error("Firebase update error", e);
    }
  }

  // Fallback to localStorage
  const list = await getWatchlist();
  const updated = list.filter(item => String(item.movieId) !== String(movieId));
  localStorage.setItem(`watchlist_${userId}`, JSON.stringify(updated));
  return { success: true };
};

export const checkInWatchlist = async (movieId) => {
  const list = await getWatchlist();
  return list.some(item => String(item.movieId) === String(movieId));
};

// USER APIS (Mocking db.json behavior with localStorage and Firebase)
export const getUserByEmail = async (email) => {
  if (isFirebaseConfigured()) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return { ...userData, id: querySnapshot.docs[0].id };
      }
    } catch (e) {
      console.error("Firebase fetch user error", e);
    }
  }

  try {
    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    return users.find(u => u.email === email) || null;
  } catch(e) {
    return null;
  }
};

export const createUser = async (userData) => {
  const newUser = { ...userData, id: Date.now().toString() };
  
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch (e) {
      console.error("Firebase createUser error", e);
    }
  }

  try {
    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));
    return newUser;
  } catch(e) {
    return newUser;
  }
};

export const updateUser = async (id, userData) => {
  if (isFirebaseConfigured()) {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, userData);
    } catch (e) {
      console.error("Firebase updateUser error", e);
    }
  }

  try {
    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const index = users.findIndex(u => String(u.id) === String(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem('mock_users', JSON.stringify(users));
      return users[index];
    }
    return null;
  } catch(e) {
    return null;
  }
};
