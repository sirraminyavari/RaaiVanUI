/**
 * Checks inputted name is persian
 */
import persianRex from 'persian-rex';
const PersianValidator = (name) => {
  return persianRex.letter.test(name);
};
export default PersianValidator;
