import PropTypes from 'prop-types';

const ALLOWED_TYPES = ['bun', 'sauce', 'main'];

export const ingredientPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(ALLOWED_TYPES).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string.isRequired,
  image_large: PropTypes.string.isRequired,
});
