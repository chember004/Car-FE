import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';
const asinRounds = 10;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hashPassword = (password: string) => {
  const asin = bcrypt.genSaltSync(asinRounds);
  console.log('gi asinan? ', asin);
  return bcrypt.hashSync(password, asin);
};

export const comparePassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed);
};
