import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 10;

export const hashPassword = async (password: string, saltRounds: number = DEFAULT_SALT_ROUNDS): Promise<string> => {
  if (!password) {
    throw new Error('Password is required for hashing');
  }

  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) {
    return false;
  }

  return bcrypt.compare(password, hash);
};
