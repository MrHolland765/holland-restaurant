import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CUSTOMER } from '../data/mockData';
import { loginUser, registerUser } from '../API';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('holland_user');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('holland_role');
    return saved || 'customer';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('holland_token')));

  useEffect(() => {
    localStorage.setItem('holland_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('holland_role', currentRole);
  }, [currentRole]);

  const login = async (identifier, password, role = 'customer') => {
  try {
    const data = await loginUser(identifier, password);

    const user = data.user;

    // Hakikisha role iliyochaguliwa kwenye frontend
    // inaendana na role ya account iliyopo database
    if (user.role !== role) {
      return {
        success: false,
        message: `This account is registered as ${user.role}`,
      };
    }

    const updatedUser = {
      ...currentUser,
      id: user.id,
      fullName: user.full_name,
      username: '@' + user.email.split('@')[0],
      email: user.email,
      phone: user.phone || (identifier.includes('@') ? '' : identifier),
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

  const logout = () => {
    localStorage.removeItem('holland_token');
    localStorage.removeItem('holland_role');
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    return { success: true };
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
