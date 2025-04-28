'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FormContext = createContext();

const initialState = {
  formId: null,
  steps: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false,
  },
};

const formReducer = (state, action) => {
  console.log('FormContext reducer - Action:', action);
  switch (action.type) {
    case 'SET_FORM_ID':
      // console.log('Setting formId in reducer:', action.payload);
      return { ...state, formId: action.payload };

    case 'SET_STEP_COMPLETED':
      // console.log('Setting step completed:', action.payload);
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.payload]: true,
        },
      };

    case 'SET_MULTIPLE_STEPS_COMPLETED':
      // console.log('Setting multiple steps completed:', action.payload);
      return {
        ...state,
        steps: { ...state.steps, ...action.payload },
      };

    case 'RESET_STEPS':
      // console.log('Resetting all steps');
      return {
        ...state,
        steps: initialState.steps,
      };

    case 'RESET_FORM':
      // console.log('Resetting entire form state');
      return initialState;

    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const getInitialState = () => {
    if (typeof window === 'undefined') {
      return initialState;
    }

    try {
      const storedFormId = localStorage.getItem('formId');
      const storedSteps = localStorage.getItem('formSteps');

      // console.log('Initial formId from localStorage:', storedFormId);
      // console.log('Initial steps from localStorage:', storedSteps);

      return {
        formId: storedFormId || null,
        steps: storedSteps ? JSON.parse(storedSteps) : initialState.steps,
      };
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(formReducer, getInitialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // console.log('Saving formId to localStorage:', state.formId);
        // console.log('Saving steps to localStorage:', state.steps);

        if (state.formId) {
          localStorage.setItem('formId', state.formId);
        } else {
          localStorage.removeItem('formId');
        }

        localStorage.setItem('formSteps', JSON.stringify(state.steps));
      } catch (error) {
        // console.error('Error saving state to localStorage:', error);
      }
    }
  }, [state.formId, state.steps]);

  // Clear localStorage when form is reset
  const resetForm = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('formId');
      localStorage.removeItem('formSteps');
    }
    dispatch({ type: 'RESET_FORM' });
  };

  // Expose resetForm function in context
  const contextValue = {
    state,
    dispatch,
    resetForm,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
