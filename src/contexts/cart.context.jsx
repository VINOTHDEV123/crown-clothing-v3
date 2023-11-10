import { createContext,useReducer } from 'react';

export const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

export const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  if(existingCartItem.quantity === 1){
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }
  return cartItems.map((cartItem) =>
  cartItem.id === cartItemToRemove.id
    ? { ...cartItem, quantity: cartItem.quantity - 1 }
    : cartItem
);
};

const cleaCartItem = (cartItems, cartItemToClear ) => cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

   
export const CartContext = createContext({
  isCartOpen: false,
  setIsOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart:() => {},
  cartCount: 0,
  cartTotal: 0
});

const CART_ACTION_TYPES = {
  SET_CART_ITEMS: 'SET-CART_ITEMS',
  SET_IS_CART_OPEN : 'SET_IS_CART_OPEN'
}

const INITIAL_STATE = {
  isCartOpen: true,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0
}

const cartReducer = (state, action) => {
  const {type, payload} = action;

  switch(type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return{
        ...state,
        ...payload,
      };
     case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return{
        ...state,
        isCartOpen: payload,
        }; 
      default:
        throw new Error('unhandled type of ${type} in cartReducer')
  }
}
export const CartProvider = ({ children }) => {

  const [{cartItems, isCartOpen, cartCount, cartTotal}, dispatch] = 
     useReducer(cartReducer, INITIAL_STATE);



  const updateCartItemsReducer = (newCartItems) => {

    const newCartCount = newCartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    const newCartTotal = newCartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );

    dispatch({
      type: CART_ACTION_TYPES.SET_CART_ITEMS, 
      payload: { 
      cartItems: newCartItems, 
      cartTotal: newCartTotal, 
      cartCount: newCartCount
    },
  });
 };


    const addItemToCart = (product) => {
    const newCartItems = addCartItem(cartItems, product);
    updateCartItemsReducer(newCartItems);
    };

    const removeItemFromCart = (cartItemToRemove) => {
    const newCartItems = removeCartItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(newCartItems);
    };

    const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = cleaCartItem(cartItems, cartItemToClear);
    updateCartItemsReducer(newCartItems);
    };

    const setIsCartOpen = (bool) => {
      dispatch({type:CART_ACTION_TYPES.SET_IS_CART_OPEN, payload: bool});
    }

  const value = {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    cartCount,
    cartTotal
    
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};