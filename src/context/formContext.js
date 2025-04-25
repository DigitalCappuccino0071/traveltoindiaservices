'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FormContext = createContext();

const initialState = {
  formId: null,
};

const formReducer = (state, action) => {
  console.log('FormContext reducer - Action:', action);
  switch (action.type) {
    case 'SET_FORM_ID':
      console.log('Setting formId in reducer:', action.payload);
      return { ...state, formId: action.payload };

    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  if (typeof window !== 'undefined') {
    const storedFormId = localStorage.getItem('formId');
    console.log('Initial formId from localStorage:', storedFormId);
    initialState.formId = storedFormId ? storedFormId : initialState.formId;
  }

  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Saving formId to localStorage:', state.formId);
      localStorage.setItem('formId', state.formId);
    }
  }, [state.formId]);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
