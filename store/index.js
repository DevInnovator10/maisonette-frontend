import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';

import activeFilterAccordionReducer from './modules/activeFilterAccordion/reducer';
import activePetiteProfileReducer from './modules/activePetiteProfile/reducer';
import activePromoReducer from './modules/activePromo/reducer';
import activeQuickshopReducer from './modules/activeQuickshop/reducer';
import cartReducer from './modules/cart/reducer';
import interfacesReducer from './modules/interfaces/reducer';
import listsReducer from './modules/lists/reducer';
import navigationReducer from './modules/navigation/reducer';
import petitesReducer from './modules/petites/reducer';
import productReducer from './modules/product/reducer';
import productsReducer from './modules/products/reducer';
import profileReducer from './modules/profile/reducer';
import promotionsReducer from './modules/promotions/reducer';
import userReducer from './modules/user/reducer';

const reducer = (state = {}, action) => {
    switch (action.type) {
    case HYDRATE: return { ...state, ...action.payload };
    default: return state;
  }
};

export const rootReducer = combineReducers({
  hydrate: reducer,
  activeFilterAccordion: activeFilterAccordionReducer,
  activePetiteProfile: activePetiteProfileReducer,
  activePromo: activePromoReducer,
  activeQuickshop: activeQuickshopReducer,
  cart: cartReducer,
  interfaces: interfacesReducer,
  lists: listsReducer,
  navigation: navigationReducer,
  petites: petitesReducer,
  product: productReducer,
  products: productsReducer,
  profile: profileReducer,
  promotions: promotionsReducer,
  user: userReducer
});

const makeStore = ({
  AppTree,
  Component,
  ctx,
  defaultLocale,
  locale,
  locales,
  params,
  query,
  req,
  res,
  resolvedUrl,
  router,
  ...context
}) => (
  createStore(rootReducer, context, composeWithDevTools(applyMiddleware(thunkMiddleware)))
);

export const storeWrapper = createWrapper(makeStore);
