import { parseISO } from 'date-fns';

export const minDate = daysToAdd => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysToAdd);
  return futureDate;
};

export const minDateWithDate = (daysToAdd, date) => {
  // If date is a string, parse it using parseISO
  const today = typeof date === 'string' ? parseISO(date) : new Date(date);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysToAdd);
  return futureDate;
};
