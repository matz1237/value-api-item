import bcrypt from 'bcryptjs';

const PEPPER = process.env.PASSWORD_PEPPER;

export const hashPassword = async (password: string): Promise<string> => {
  const pepperedPassword = password + PEPPER;
  const salt = await bcrypt.genSalt(12); // Increased rounds for better security
  return bcrypt.hash(pepperedPassword, salt);
};

export const verifyPassword = async (
  providedPassword: string,
  storedHash: string
): Promise<boolean> => {
  const pepperedPassword = providedPassword + PEPPER;
  return bcrypt.compare(pepperedPassword, storedHash);
};