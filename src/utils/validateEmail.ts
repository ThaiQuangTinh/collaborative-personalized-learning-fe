export const validateEmail = (email: string): boolean => {
  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
};
