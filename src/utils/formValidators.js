export const required = (input) => (input ? true : "This is a required field");

export const positiveNumber = (input) => {
  const number = Number(input);
  return Number.isInteger(number) && number > 0
    ? true
    : "Must be an integer greater than 0";
};

export const fileTypeRule = (value) => {
  if (!value || !value.length) return true; // Allow empty input
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  return (
    allowedTypes.includes(value[0].type) ||
    "Only PNG, JPG, WEBP, and JPEG files are allowed."
  );
};
