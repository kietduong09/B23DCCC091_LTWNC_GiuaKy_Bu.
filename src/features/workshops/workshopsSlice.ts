import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchWorkshops } from '../../api/workshopsApi';
import type { FetchWorkshopsOptions } from '../../api/workshopsApi';
import { isApiSuccess } from '../../types/api';
import { REJECT_MESSAGES } from './types';
import type { Notice, RegistrationRejectedPayload, Workshop, WorkshopsState } from './types';

export const initialState: WorkshopsState = {
  items: [],
  registeredIds: [],
  status: 'idle',
  error: null,
  notice: null,
};

// Thunk tải danh sách workshop. Tham số tùy chọn dùng để giả lập lỗi API.
export const loadWorkshops = createAsyncThunk<
  Workshop[],
  Partial<FetchWorkshopsOptions> | undefined,
  { rejectValue: string }
>('workshops/load', async (options, { rejectWithValue }) => {
  const response = await fetchWorkshops(options);
  if (isApiSuccess(response)) {
    return response.data;
  }
  return rejectWithValue(response.error);
});

function setNotice(state: WorkshopsState, notice: Notice): void {
  state.notice = notice;
}

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {
    // Đăng ký workshop.
    // Lưu ý: giới hạn tối đa 3 workshop KHÔNG kiểm tra ở đây mà do
    // registrationMiddleware chặn trước khi action này đến reducer.
    registerWorkshop(state, action: PayloadAction<number>) {
      const workshopId = action.payload;
      const workshop = state.items.find((item) => item.id === workshopId);
      if (!workshop) return;

      if (state.registeredIds.includes(workshopId)) {
        setNotice(state, { type: 'error', message: REJECT_MESSAGES.duplicate });
        return;
      }
      if (workshop.remainingSeats <= 0) {
        setNotice(state, { type: 'error', message: REJECT_MESSAGES.full });
        return;
      }

      // Hai thay đổi này luôn đi cùng nhau để danh sách đăng ký và số chỗ không bị lệch.
      state.registeredIds.push(workshopId);
      workshop.remainingSeats -= 1;
      setNotice(state, { type: 'success', message: `Đăng ký thành công: ${workshop.name}.` });
    },

    // Huỷ đăng ký workshop.
    cancelRegistration(state, action: PayloadAction<number>) {
      const workshopId = action.payload;
      const workshop = state.items.find((item) => item.id === workshopId);
      if (!workshop || !state.registeredIds.includes(workshopId)) return;

      state.registeredIds = state.registeredIds.filter((id) => id !== workshopId);
      // Không cho số chỗ còn lại vượt quá tổng số chỗ.
      workshop.remainingSeats = Math.min(workshop.totalSeats, workshop.remainingSeats + 1);
      setNotice(state, { type: 'success', message: `Đã huỷ đăng ký: ${workshop.name}.` });
    },

    // Action do middleware phát ra khi chặn một lần đăng ký.
    // Chỉ cập nhật thông báo, không đụng đến items hay registeredIds.
    registrationRejected(state, action: PayloadAction<RegistrationRejectedPayload>) {
      setNotice(state, { type: 'error', message: REJECT_MESSAGES[action.payload.reason] });
    },

    clearNotice(state) {
      state.notice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkshops.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadWorkshops.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // Dữ liệu mới được tải về nên danh sách đăng ký bắt đầu lại từ đầu.
        state.registeredIds = [];
      })
      .addCase(loadWorkshops.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định.';
      });
  },
});

export const { registerWorkshop, cancelRegistration, registrationRejected, clearNotice } =
  workshopsSlice.actions;

export default workshopsSlice.reducer;
