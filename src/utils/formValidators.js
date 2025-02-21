export const required = (input) => (input ? true : "This is a required field");

export const positiveNumber = (input) => {
  const number = Number(input);
  return Number.isInteger(number) && number > 0
    ? true
    : "Must be an integer greater than 0";
};
