import reducer, {
	fetchOrderBurger,
	fetchOrderByNumber,
	fetchOrders,
	orderActions
  } from '../slices/orderSlice';
  import { TOrder } from '../../utils/types';
  
  jest.mock('../../utils/burger-api', () => ({
	orderBurgerApi: jest.fn(),
	getOrderByNumberApi: jest.fn(),
	getOrdersApi: jest.fn()
  }));
  
  const initialState = {
	order: null,
	orders: [],
	isLoading: false,
	error: null
  };
  
  const testOrder: TOrder = {
	_id: '1',
	status: 'done',
	name: 'Test Order',
	createdAt: '2023-01-01T00:00:00.000Z',
	updatedAt: '2023-01-01T00:00:00.000Z',
	number: 123,
	ingredients: ['ingredient1', 'ingredient2']
  };
  
  const testOrders: TOrder[] = [testOrder];
  
  describe('order reducer', () => {
	it('fetchOrderBurger - pending', () => {
	  const action = fetchOrderBurger.pending('', []);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	  expect(state.error).toBe(null);
	});
  
	it('fetchOrderBurger - fulfilled', () => {
	  const action = fetchOrderBurger.fulfilled(testOrder, '', []);
	  const state = reducer(initialState, action);
	  expect(state.order).toEqual(testOrder);
	  expect(state.isLoading).toBe(false);
	});
  
	it('fetchOrderBurger - rejected', () => {
	  const error = 'Ошибка при создании заказа';
	  const action = fetchOrderBurger.rejected(new Error(), '', [], error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	});
  
	it('fetchOrderByNumber - pending', () => {
	  const action = fetchOrderByNumber.pending('', 123);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	  expect(state.error).toBe(null);
	});
  
	it('fetchOrderByNumber - fulfilled', () => {
	  const action = fetchOrderByNumber.fulfilled(testOrder, '', 123);
	  const state = reducer(initialState, action);
	  expect(state.order).toEqual(testOrder);
	  expect(state.isLoading).toBe(false);
	});
  
	it('fetchOrderByNumber - rejected', () => {
	  const error = 'Ошибка при получении заказа';
	  const action = fetchOrderByNumber.rejected(new Error(), '', 123, error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	});
  
	it('fetchOrders - pending', () => {
	  const action = fetchOrders.pending('', undefined);
	  const state = reducer(initialState, action);
	  expect(state.isLoading).toBe(true);
	  expect(state.error).toBe(null);
	});
  
	it('fetchOrders - fulfilled', () => {
	  const action = fetchOrders.fulfilled(testOrders, '', undefined);
	  const state = reducer(initialState, action);
	  expect(state.orders).toEqual(testOrders);
	  expect(state.isLoading).toBe(false);
	});
  
	it('fetchOrders - rejected', () => {
	  const error = 'Ошибка при получении заказов';
	  const action = fetchOrders.rejected(new Error(), '', undefined, error);
	  const state = reducer(initialState, action);
	  expect(state.error).toBe(error);
	  expect(state.isLoading).toBe(false);
	});
  
	it('orderModalDataAction', () => {
	  const action = orderActions.orderModalDataAction(testOrder);
	  const state = reducer(initialState, action);
	  expect(state.order).toEqual(testOrder);
	});
  
	it('clearOrderModalDataAction', () => {
	  const action = orderActions.clearOrderModalDataAction();
	  const state = reducer({ ...initialState, order: testOrder }, action);
	  expect(state.order).toBe(null);
	});
  });
