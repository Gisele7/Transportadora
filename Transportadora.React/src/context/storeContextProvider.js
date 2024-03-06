import React, { useContext, useReducer } from "react";

const initialState = {
  codigoCliente: 0,
  codigoEntrada: 0,
  usuario: " ",
  unidade: "",
};

export const StoreContext = React.createContext({ ...initialState });

StoreContext.displayName = "storeDados";

export const useAppState = () => useContext(StoreContext);

export const StoreContextProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, {
    ...initialState,
    codigoCliente: props.codigoCliente,
    codigoEntrada: props.codigoEntrada,
  });

  const setCodigoCliente = (val) => {
    dispatch({ type: eAction.SET_CODIGOCLIENTE, payload: val });
  };

  const setCodigoEntrada = (val) => {
    dispatch({ type: eAction.SET_CODIGOENTRADA, payload: val });
  };

  const setUsuario = (val) => {
    dispatch({ type: eAction.SET_USUARIO, payload: val });
  };

  const setUnidade = (val) => {
    dispatch({ type: eAction.SET_UNIDADE, payload: val });
  };

  return (
    <StoreContext.Provider
      value={{
        ...state,
        dispatch,
        setCodigoCliente,
        setCodigoEntrada,
        setUsuario,
        setUnidade,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export const eAction = {
  SET_CODIGOCLIENTE: 0,
  SET_CODIGOENTRADA: 1,
  SET_USUARIO: 2,
  SET_UNIDADE: 3,
};

export const AppReducer = (state = initialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case eAction.SET_CODIGOCLIENTE:
      return { ...state, codigoCliente: payload || 0 };
    case eAction.SET_CODIGOENTRADA:
      return { ...state, codigoEntrada: payload || 0 };
    case eAction.SET_USUARIO:
      return { ...state, usuario: payload || " " };
      case eAction.SET_UNIDADE:
        return { ...state, unidade: payload || "" };
  }
};
