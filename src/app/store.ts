import { combineReducers, configureStore } from '@reduxjs/toolkit';
import workshopsReducer from '../features/workshops/workshopsSlice';
import { registrationMiddleware } from './middleware/registrationMiddleware';

const rootReducer = combineReducers({
  workshops: workshopsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Dùng hàm tạo store để test có thể tạo store mới cho mỗi test case.
export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(registrationMiddleware),
  });
}

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
