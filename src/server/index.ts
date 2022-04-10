import {
  onOpen,
  openSidebar,
} from './ui';

import { insertPlain } from './functions/insertPlain';
import { formatValue } from './functions/formatValue';
import { insertStatistic } from './functions/insertStatistic';
import { insertStatistics } from './functions/insertStatistics';
import { insertTable } from './functions/insertTable';
import { updateStatistics } from './functions/updateStatistics';

// Public functions must be exported as named exports
export {
  onOpen,
  openSidebar,
  insertPlain,
  formatValue,
  updateNamedRange,
  insertStatistic,
  insertStatistics,
  insertTable,
  updateStatistics
};
