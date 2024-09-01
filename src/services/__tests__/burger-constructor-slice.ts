import burgerConstructorReducer, {
  burgerConstructorActions
} from '../slices/BurgerConstructor';
import { TConstructorIngredient } from '@utils-types';
import { v4 as createId } from 'uuid';

// Пробный ингредиент
const testIngredient: TConstructorIngredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'test-image-url',
  image_mobile: 'test-image-url',
  image_large: 'test-image-url',
  id: createId()
};

const bunIngredient: TConstructorIngredient = {
  ...testIngredient,
  type: 'bun',
  id: createId() // Генерируем id для булки
};

describe('burgerConstructorReducer', () => {
  const initialState = {
    bun: null,
    ingredients: [] as TConstructorIngredient[]
  };

  test('Тестирование добавления ингредиента', () => {
    const action = burgerConstructorActions.addIngredient(testIngredient);
    const state = burgerConstructorReducer(initialState, action);

    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        ...testIngredient,
        id: expect.any(String) // Проверяем, что id сгенерирован
      })
    );
    expect(state.bun).toBeNull(); // Булка не должна измениться
  });

  test('Тестирование добавления булки', () => {
    const action = burgerConstructorActions.addIngredient(bunIngredient);
    const state = burgerConstructorReducer(initialState, action);

    expect(state.bun).toEqual(
      expect.objectContaining({
        ...bunIngredient,
        id: expect.any(String) // Проверяем, что id сгенерирован
      })
    );
    expect(state.ingredients.length).toBe(0); // Ингредиенты не должны измениться
  });

  test('Тестирование удаления ингредиента', () => {
    const preloadedState = {
      bun: null,
      ingredients: [
        { ...testIngredient, id: createId() },
        { ...testIngredient, id: createId() }
      ]
    };

    const action = burgerConstructorActions.removeIngredient(0);
    const state = burgerConstructorReducer(preloadedState, action);

    expect(state.ingredients.length).toBe(1); // Один ингредиент должен быть удален
    expect(state.ingredients[0].id).not.toEqual(
      preloadedState.ingredients[0].id
    ); // Проверка, что ID первого ингредиента изменился
  });

  test('Тестирование изменения порядка ингредиентов', () => {
    const ingredient1: TConstructorIngredient = {
      ...testIngredient,
      id: createId()
    };

    const ingredient2: TConstructorIngredient = {
      ...testIngredient,
      id: createId()
    };

    const preloadedState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const action = burgerConstructorActions.dragIngredient({ from: 0, to: 1 });
    const state = burgerConstructorReducer(preloadedState, action);

    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);

    // Проверка обратного порядка
    const actionReverse = burgerConstructorActions.dragIngredient({
      from: 1,
      to: 0
    });
    const stateReverse = burgerConstructorReducer(state, actionReverse);

    expect(stateReverse.ingredients[0]).toEqual(ingredient1);
    expect(stateReverse.ingredients[1]).toEqual(ingredient2);
  });
});
