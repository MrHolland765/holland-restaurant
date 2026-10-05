export const PASSWORD_REQUIREMENTS = [
  {
    key: 'length',
    test: (password) => password.length >= 8,
    sw: 'Angalau herufi 8',
    en: 'At least 8 characters',
  },
  {
    key: 'uppercase',
    test: (password) => /[A-Z]/.test(password),
    sw: 'Herufi kubwa (A-Z)',
    en: 'An uppercase letter (A-Z)',
  },
  {
    key: 'lowercase',
    test: (password) => /[a-z]/.test(password),
    sw: 'Herufi ndogo (a-z)',
    en: 'A lowercase letter (a-z)',
  },
  {
    key: 'number',
    test: (password) => /\d/.test(password),
    sw: 'Namba (0-9)',
    en: 'A number (0-9)',
  },
  {
    key: 'special',
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
    sw: 'Alama maalum (mfano: !@#)',
    en: 'A special character (e.g. !@#)',
  },
];

export const isStrongPassword = (password) =>
  typeof password === 'string' &&
  PASSWORD_REQUIREMENTS.every(({ test }) => test(password));
