import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../API';

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

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem('holland_token'))
  );

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

      const updatedUser = {
        id: user.id,
        fullName: user.full_name,
        username: '@' + user.email.split('@')[0],
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
      };

      setCurrentUser(updatedUser);
      setCurrentRole(user.role);

      localStorage.setItem('holland_token', data.token);

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

      localStorage.setItem('holland_token', data.token);

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

  const updateProfile = (updatedFields) => {

    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));

    return {
      success: true,
    };
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