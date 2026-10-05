import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, saveProfileAvatar } from '../API';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // Hakuna tena DEFAULT_CUSTOMER
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('holland_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('holland_role');
    return saved || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    localStorage.removeItem('holland_token');
    return Boolean(sessionStorage.getItem('holland_token'));
  });

  // Save user only when there is an authenticated user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        'holland_user',
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem('holland_user');
    }
  }, [currentUser]);

  // Save role only when there is a role
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('holland_role', currentRole);
    } else {
      localStorage.removeItem('holland_role');
    }
  }, [currentRole]);


  // =========================
  // LOGIN
  // =========================

  const login = async (identifier, password, selectedRole) => {
    try {
      const data = await loginUser(identifier, password);

      const user = data.user;  

      if (selectedRole !== user.role) {
  return {
    success: false,
    message: `Umechagua role ya ${selectedRole}, lakini account hii ni ya ${user.role}.`,
  };
}

      const savedUser = JSON.parse(localStorage.getItem('holland_user') || 'null');
      const cachedAvatar =
        savedUser?.id === user.id && savedUser?.email === user.email
          ? savedUser.avatar
          : null;
      const avatar =
        user.avatar ||
        cachedAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';

      const updatedUser = {
        id: user.id,
        fullName: user.full_name,
        username: '@' + user.email.split('@')[0],
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        avatar,
        role: user.role,
      };

      sessionStorage.setItem('holland_token', data.token);

      if (!user.avatar && cachedAvatar?.startsWith('data:image/jpeg;base64,')) {
        try {
          const savedAvatar = await saveProfileAvatar(cachedAvatar);
          updatedUser.avatar = savedAvatar.avatar;
        } catch (error) {
          console.error('Failed to sync the locally saved profile image:', error);
        }
      }

      setCurrentUser(updatedUser);
      setCurrentRole(user.role);

      setIsAuthenticated(true);

      return {
        success: true,
        user: updatedUser,
      };

    } catch (error) {

      return {
        success: false,
        message: error.message || 'Invalid email or password',
      };
    }
  };


  // =========================
  // REGISTER CUSTOMER
  // =========================

  const register = async (formData) => {
    try {

      const data = await registerUser(
        formData.fullName,
        formData.email,
        formData.password,
        'customer',
        formData.phone,
        formData.address
      );

      const newUser = {
        id: data.userId,
        fullName: formData.fullName,
        username:
          '@' +
          formData.fullName
            .toLowerCase()
            .replace(/\s+/g, '_'),
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        role: 'customer',
      };

      setCurrentUser(newUser);
      setCurrentRole('customer');

      sessionStorage.setItem('holland_token', data.token);

      setIsAuthenticated(true);

      return {
        success: true,
        user: newUser,
      };

    } catch (error) {

      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  };


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    // Ondoa kila taarifa ya session
    sessionStorage.removeItem('holland_token');
    localStorage.removeItem('holland_token');
    localStorage.removeItem('holland_role');
    localStorage.removeItem('holland_user');

    // Safisha state
    setCurrentUser(null);
    setCurrentRole(null);
    setIsAuthenticated(false);
  };


  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async (updatedFields) => {
    if (!currentUser) {
      return {
        success: false,
        message: 'Hakuna akaunti iliyoingia kwa sasa.',
      };
    }

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    try {
      if (updatedFields.avatar?.startsWith('data:image/jpeg;base64,')) {
        const savedAvatar = await saveProfileAvatar(updatedFields.avatar);
        updatedUser.avatar = savedAvatar.avatar;
      }

      localStorage.setItem('holland_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Failed to save profile:', error);
      return {
        success: false,
        message: error.message || 'Imeshindikana kuhifadhi picha ya wasifu.',
      };
    }
  };


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};