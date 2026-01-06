import produce from '../../produce';

import * as types from './types';
import { navigation as staticNavigation } from '../../../navigation';
import { navigation as staticMobileNavigation } from '../../../cms-generals';

const initialState = {
  desktop: staticNavigation,
  mobile: staticMobileNavigation
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.NAVIGATION_SET_DESKTOP:
      draft.desktop = action.payload;
      break;

    case types.NAVIGATION_SET_MOBILE:
      draft.mobile = action.payload;
      break;
  }
}, initialState);

export default reducer;
