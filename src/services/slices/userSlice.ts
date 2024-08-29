import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: true,
  error: null
};

const setAuthTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearAuthTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

const handleError = (error: unknown, defaultMessage: string) => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    return (error as any).response?.data?.message || defaultMessage;
  } else {
    return defaultMessage;
  }
};

export const fetchRegisterUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const registerData = await registerUserApi(data);
      setCookie('refreshToken', registerData.refreshToken);
      setCookie('accessToken', registerData.accessToken);
      return registerData;
    } catch (error) {
      return rejectWithValue('Ошибка при регистрации');
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(loginData);
      setAuthTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      return rejectWithValue(handleError(error, 'Ошибка при авторизации'));
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        handleError(error, 'Ошибка при получении данных пользователя')
      );
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async (user: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(user);
      return data;
    } catch (error) {
      return rejectWithValue(
        handleError(error, 'Ошибка при обновлении данных пользователя')
      );
    }
  }
);

export const fetchLogout = createAsyncThunk(
  'user/fetchLogout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearAuthTokens();
    } catch (error) {
      return rejectWithValue(
        handleError(error, 'Ошибка при выходе из системы')
      );
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthChecked = false;
      state.isLoading = false;
      state.error = null;
      clearAuthTokens();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
        state.isLoading = false;
        state.error = null;
      });
  }
});

export const { logoutUser } = userSlice.actions;

export const userSelectors = {
  userSelector: (state: { user: TUserState }) => state.user.user,
  isAuthCheckedSelector: (state: { user: TUserState }) =>
    state.user.isAuthChecked,
  isLoadingSelector: (state: { user: TUserState }) => state.user.isLoading,
  errorSelector: (state: { user: TUserState }) => state.user.error
};

export default userSlice.reducer;
