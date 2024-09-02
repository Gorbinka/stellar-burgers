import reducer, { 
	fetchRegisterUser, 
	fetchLoginUser, 
	fetchUser,
	fetchUpdateUser,
	fetchLogout,
	logoutUser
  } from '../slices/userSlice';
  import { TUser } from '../../utils/types';
  import { TRegisterData, TLoginData } from '../../utils/burger-api';
  
  jest.mock('../../utils/burger-api', () => ({
	registerUserApi: jest.fn(),
	loginUserApi: jest.fn(),
	getUserApi: jest.fn(),
	logoutApi: jest.fn(),
	updateUserApi: jest.fn()
  }));
  
  const initialState = {
	user: null,
	isAuthChecked: false,
	isLoading: true,
	error: null
  };
  
  const testUser: TUser = {
	name: 'Даниил',
	email: 'daniilgorbacev20109@yandex.ru',
	password: 'password'
  };
  
  const authResponse = {
	success: true,
	user: testUser,
	accessToken: 'testAccessToken',
	refreshToken: 'testRefreshToken'
  };
  
  const loginData: TLoginData = {
	email: 'daniilgorbacev20109@yandex.ru',
	password: 'password'
  };
  
  const registerData: TRegisterData = {
	name: 'Даниил',
	email: 'daniilgorbacev20109@yandex.ru',
	password: 'password'
  };
  
  describe('user reducer', () => {
	it('fetchRegisterUser - pending', () => {
	  const action = fetchRegisterUser.pending('', registerData);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	});
  
	it('fetchRegisterUser - fulfilled', () => {
	  const action = fetchRegisterUser.fulfilled(authResponse, '', registerData);
	  const state = reducer(initialState, action);
	  expect(state.user).toEqual(testUser);
	  expect(state.isAuthChecked).toBe(true);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null);
	});
  
	it('fetchRegisterUser - rejected', () => {
	  const error = 'Ошибка при регистрации';
	  const action = fetchRegisterUser.rejected(new Error(), '', registerData, error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	  expect(state.isAuthChecked).toBe(false);
	});
  
	it('fetchLoginUser - pending', () => {
	  const action = fetchLoginUser.pending('', loginData);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	});
  
	it('fetchLoginUser - fulfilled', () => {
	  const action = fetchLoginUser.fulfilled(authResponse, '', loginData);
	  const state = reducer(initialState, action);
	  expect(state.user).toEqual(testUser);
	  expect(state.isAuthChecked).toBe(true);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null);
	});
  
	it('fetchLoginUser - rejected', () => {
	  const error = 'Ошибка при авторизации';
	  const action = fetchLoginUser.rejected(new Error(), '', loginData, error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	  expect(state.isAuthChecked).toBe(true);
	});
  
	it('fetchUser - pending', () => {
	  const action = fetchUser.pending('', undefined);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	});
  
	it('fetchUser - fulfilled', () => {
	  const action = fetchUser.fulfilled({ success: true, user: testUser }, '', undefined);
	  const state = reducer(initialState, action);
	  expect(state.user).toEqual(testUser);
	  expect(state.isAuthChecked).toBe(true);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null);
	});
  
	it('fetchUser - rejected', () => {
	  const error = 'Ошибка при получении данных пользователя';
	  const action = fetchUser.rejected(new Error(), '', undefined, error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	  expect(state.isAuthChecked).toBe(true);
	});
  
	it('fetchUpdateUser - pending', () => {
	  const action = fetchUpdateUser.pending('', registerData);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	});
  
	it('fetchUpdateUser - fulfilled', () => {
	  const action = fetchUpdateUser.fulfilled({ success: true, user: testUser }, '', registerData);
	  const state = reducer(initialState, action);
	  expect(state.user).toEqual(testUser);
	  expect(state.isAuthChecked).toBe(true);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null);
	});
  
	it('fetchUpdateUser - rejected', () => {
	  const error = 'Ошибка при обновлении данных пользователя';
	  const action = fetchUpdateUser.rejected(new Error(), '', registerData, error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	  expect(state.isAuthChecked).toBe(true);
	});
  
	it('fetchLogout - fulfilled', () => {
	  const action = fetchLogout.fulfilled(undefined, '', undefined);
	  const state = reducer(initialState, action);
	  expect(state.user).toBe(null);
	  expect(state.isAuthChecked).toBe(false);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null);
	});
  
	it('logoutUser action', () => {
	  const action = logoutUser();
	  const state = reducer({ ...initialState, user: testUser, isAuthChecked: true }, action);
	  expect(state.user).toBe(null);
	  expect(state.isAuthChecked).toBe(false);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null);
	});
  });
