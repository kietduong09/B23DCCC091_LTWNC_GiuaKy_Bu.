import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Typed hooks: dùng thay cho useDispatch / useSelector thông thường.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
