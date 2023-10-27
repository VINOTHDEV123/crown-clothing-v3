import { createContext, useState, useEffect, useReducer } from 'react';

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
  cartItemsCount: 0,
  cartTotal: 0
});

const INITIAL_STATE = {
  isCartOpen: true,
  cartItems: [],
  cartItemsCount: 0,
  cartTotal: 0
}

const cartReducer = (state, action) => {
  const {type, payload} = action;

  switch(type) {
    case 'SETCART_ITEMS':
      return{
        ...state,
        ...payload
      }
      default:
        throw new Error('unhandled type of ${type} in cartReducer')
  }
}
export const CartProvider = ({ children }) => {

  const [{cartItems, isCartOpen, cartItemsCount, cartTotal}, dispatch] = 
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

    dispatch({type: 'SET_CART_ITEMS', payload: { 
      cartItems: newCartItems, 
      cartTotal: newCartTotal, 
      cartItemsCount: newCartCount
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

  const value = {
    isCartOpen,
    setIsCartOpen: () => {},
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    cartItemsCount,
    cartTotal
    
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};