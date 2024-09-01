import { TIngredient } from '../../utils/types';
import reducer, { fetchIngredients } from '../slices/ingredientsSlice';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const ingredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 200,
  price: 50,
  image: 'test-image-url',
  image_mobile: 'test-image-url',
  image_large: 'test-image-url'
};

describe('ingredients reducer', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен установить isLoading в true при выполнении fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('', undefined);
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('должен сохранить ингредиенты и установить isLoading в false при выполнении fetchIngredients.fulfilled', () => {
    const ingredients: TIngredient[] = [ingredient];
    const action = fetchIngredients.fulfilled(ingredients, '', undefined);
    const state = reducer(initialState, action);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
  });

  it('должен сохранить ошибку и установить isLoading в false при выполнении fetchIngredients.rejected', () => {
    const error = 'Failed to fetch';
    const action = fetchIngredients.rejected(new Error(), '', undefined, error);
    const state = reducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.isLoading).toBe(false);
  });
});
