// src/reducers/cartReducer.js
export const initialState = {
  items: [],
  promoCode: null,
  discountPercent: 0,
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += 1;
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1, note: '' }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item)
      };
    case 'DECREMENT':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }).filter(item => item.quantity > 0)
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map(item => item.id === action.payload.id ? { ...item, note: action.payload.note } : item)
      };
    case 'APPLY_PROMO': {
      const codes = { 'WELCOME10': 10, 'FEAST20': 20 };
      const discount = codes[action.payload.code.toUpperCase()];
      if (discount) {
        return { ...state, promoCode: action.payload.code, discountPercent: discount };
      }
      return state;
    }
    case 'REMOVE_PROMO':
      return { ...state, promoCode: null, discountPercent: 0 };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};