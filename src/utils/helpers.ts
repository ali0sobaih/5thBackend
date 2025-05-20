import bcrypt from 'bcrypt';

export const generateRandomPassword = async (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return await bcrypt.hash(password, 10);
};

export const normalizeProfile = (profile: any, provider: string) => {
  if (provider === 'google') {
    return {
      id: profile.id,
      email: profile.email,
      given_name: profile.given_name,
      family_name: profile.family_name,
      name: {
        givenName: profile.given_name,
        familyName: profile.family_name
      },
      displayName: profile.displayName
    };
  }
  
  if (provider === 'facebook') {
    return {
      id: profile.id,
      emails: profile.emails,
      name: profile.name,
      displayName: profile.displayName
    };
  }
  
  return profile;
};