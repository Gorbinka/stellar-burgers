import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as createId } from 'uuid';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, id: createId() }
      })
    },
    removeIngredient: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    dragIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.ingredients];

      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      state.ingredients = ingredients;
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const burgerConstructorSelectors = {
  bunSelector: (state: { burgerConstructor: TBurgerConstructorState }) =>
    state.burgerConstructor.bun,

  ingredientsSelector: (state: {
    burgerConstructor: TBurgerConstructorState;
  }) => state.burgerConstructor.ingredients,

  constructorStateSelector: (state: {
    burgerConstructor: TBurgerConstructorState;
  }) => state.burgerConstructor
};

export const burgerConstructorActions = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
