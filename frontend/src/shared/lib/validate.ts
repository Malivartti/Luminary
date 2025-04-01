export const onlyLatinLettersAndNumbers = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(value);
};

export const validateEmailString = (value: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

export const validateUrlString = (value: string): boolean => {
  const regex = /^https?:\/\/\S+/i;
  return regex.test(value);
};

export const validateUrlId = (value: string): boolean => {
  const regex = /^\/envs\/\d+$/;
  return regex.test(value);
};
