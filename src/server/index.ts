import {
  onOpen,
  openSidebar,
} from './ui';

import { insertFullCitation } from './functions/insertFullCitation';
import { insertInTextCitation } from './functions/insertInTextCitation';
import { formatValue } from './functions/formatValue';
import { insertStatistic } from './functions/insertStatistic';
import { insertStatistics } from './functions/insertStatistics';
import { insertTable } from './functions/insertTable';
import { updateStatistics } from './functions/updateStatistics';

// Public functions must be exported as named exports
export {
  onOpen,
  openSidebar,
  insertFullCitation,
  insertInTextCitation,
  formatValue,
  updateNamedRange,
  insertStatistic,
  insertStatistics,
  insertTable,
  updateStatistics
};
