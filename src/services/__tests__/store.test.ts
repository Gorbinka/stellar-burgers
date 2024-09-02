import store from '../store';
const expectedState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  feed: {
    error: null,
    isLoading: true,
    orders: [],
    total: 0,
    totalToday: 0
  },
  ingredients: {
    error: null,
    ingredients: [],
    isLoading: false
  },
  order: {
    error: null,
    isLoading: false,
    order: null,
    orders: []
  },
  user: {
    error: null,
    isAuthChecked: false,
    isLoading: true,
    user: null
  }
};

describe('rootReducer', () => {
  it('Тестирование инициализации хранилища', () => {
    const initialState = store.getState();
    //console.log(initialState);
    expect(initialState).toEqual(expectedState);
  });

  it('Тестирование возвращения текущего состояния, если передан неизвестный экшен', () => {
    const initialState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACT' });
    expect(store.getState()).toEqual(initialState);
  });
});
