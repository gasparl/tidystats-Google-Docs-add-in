import {
  onOpen,
  openSidebar,
} from './ui';

import { insertFullCitation } from './functions/insertFullCitation';
import { insertInTextCitation } from './functions/insertInTextCitation';
import { updateNamedRange } from './functions/updateNamedRange';

// Public functions must be exported as named exports
export {
  onOpen,
  openSidebar,
  insertFullCitation,
  insertInTextCitation,
  updateNamedRange
};
