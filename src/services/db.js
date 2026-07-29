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

// WATCHLIST APIS
export const getWatchlist = async () => {
  const userId = getCurrentUserId();
  if (!userId) return [];
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
  
  const list = await getWatchlist();
  // Prevent duplicates
  if (!list.find(item => String(item.movieId) === String(id))) {
    list.push(payload);
    localStorage.setItem(`watchlist_${userId}`, JSON.stringify(list));
  }
  return payload;
};

export const removeFromWatchlist = async (movieId) => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  
  const list = await getWatchlist();
  const updated = list.filter(item => String(item.movieId) !== String(movieId));
  localStorage.setItem(`watchlist_${userId}`, JSON.stringify(updated));
  return { success: true };
};

export const checkInWatchlist = async (movieId) => {
  const userId = getCurrentUserId();
  if (!userId) return false;
  
  const list = await getWatchlist();
  return list.some(item => String(item.movieId) === String(movieId));
};

// USER APIS (Mocking db.json behavior with localStorage)
export const getUserByEmail = async (email) => {
  try {
    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    return users.find(u => u.email === email) || null;
  } catch(e) {
    return null;
  }
};

export const createUser = async (userData) => {
  try {
    const usersStr = localStorage.getItem('mock_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const newUser = { ...userData, id: Date.now().toString() };
    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));
    return newUser;
  } catch(e) {
    return { ...userData, id: Date.now().toString() };
  }
};

export const updateUser = async (id, userData) => {
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
