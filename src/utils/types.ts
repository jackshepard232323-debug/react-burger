export type TIngredientType = 'bun' | 'sauce' | 'main';

export type TIngredient = {
  _id: string;
  type: TIngredientType;
  name: string;
  price: number;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
  image: string;
  image_mobile: string;
  image_large: string;
};

export type TConstructorIngredient = {
  uid: string;
} & TIngredient;

export type TUser = {
  email: string;
  name: string;
};

export type TLoginForm = {
  email: string;
  password: string;
};

export type TRegisterForm = {
  name: string;
} & TLoginForm;
