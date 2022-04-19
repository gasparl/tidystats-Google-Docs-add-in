import {
    onOpen,
    openSidebar,
    openDialog,
} from './ui';

import { insertPlain } from './functions/insertPlain';
import { insertStatistic } from './functions/insertStatistic';
import { insertStatistics } from './functions/insertStatistics';
import { insertTable } from './functions/insertTable';
import { updateStatistics, updateColor, getColor } from './functions/updateStatistics';


// Public functions must be exported as named exports
export {
    onOpen,
    openSidebar,
    openDialog,
    insertPlain,
    insertStatistic,
    insertStatistics,
    insertTable,
    updateStatistics,
    updateColor,
    getColor
};
