import { Action, configureStore, createAsyncThunk, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { fetchUsers, TUsers } from './API';

interface UsersState {
  items: TUsers;
  itemsLength: number;
  status: 'idle' | 'loading' | 'failed';
}

interface IFetchReturnData {
  users: TUsers;
  length: number;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

const initialState: UsersState = {
  items: [],
  itemsLength: 0,
  status: 'loading',
};

export const fetchUsersAsync = createAsyncThunk<IFetchReturnData, undefined, { state: { users: UsersState } }>(
  'fetchUsers',
  async () => {
    const response = await fetchUsers();
    return { users: response.data, length: response.length };
  },
);

export const usersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    removeUser: (state, action: PayloadAction<number>) => {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: newItems, itemsLength: newItems.length };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload.users;
        state.itemsLength = action.payload.length;
      });
  },
});

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
  },
});
export const getUsers = (state: RootState) => state.users.items;

export const deleteUser = (id: number) => usersSlice.actions.removeUser(id);
