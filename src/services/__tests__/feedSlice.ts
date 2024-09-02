import { TOrdersData } from '@utils-types';
import reducer, { fetchFeed } from '../slices/feedSlice';

type TFeedState = TOrdersData & {
	isLoading: boolean;
	error: string | null;
  };

  type TFeedsResponse = {
	success: boolean;
  } & TOrdersData;

  const mockData: TFeedsResponse = {
	success: true,
	orders: [
	  {
		_id: 'order1',
		status: 'done',
		name: 'Test Order 1',
		createdAt: '',
		updatedAt: '',
		number: 1,
		ingredients: []
	  },
	  {
		_id: 'order2',
		status: 'pending',
		name: 'Test Order 2',
		createdAt: '',
		updatedAt: '',
		number: 2,
		ingredients: []
	  }
	],
	total: 100,
	totalToday: 20
  };


describe('feed reducer', () => {
	const initialState: TFeedState = {
		orders: [],
		total: 0,
		totalToday: 0,
		isLoading: true,
		error: null
	  };

  it('должен установить isLoading в true при выполнении fetchFeed.pending', () => {
	const action = fetchFeed.pending('', undefined);
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null); // Убедимся, что ошибка сброшена
  });

  it('должен сохранить ингредиенты и установить isLoading в false при выполнении fetchFeed.fulfilled', () => {
	
	  const action = fetchFeed.fulfilled(mockData, '', undefined);
	  const state = reducer(initialState, action);
	  expect(state.orders).toEqual(mockData.orders);
	  expect(state.total).toBe(mockData.total);
	  expect(state.totalToday).toBe(mockData.totalToday);
	  expect(state.isLoading).toBe(false);
	  expect(state.error).toBe(null); // Убедимся, что ошибка сброшена
  });

  it('должен сохранить ошибку и установить isLoading в false при выполнении fetchFeed.rejected', () => {
	const error = 'Неизвестная ошибка';
    const action = fetchFeed.rejected(new Error(), '', undefined, error);
    const state = reducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.isLoading).toBe(false);
  });
});
