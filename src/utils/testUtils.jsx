import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// import here all your reducer
import jobReducer from '../features/job/jobSlice';

function renderWithRedux(
  ui,
  {
    preloadedState,
    store = configureStore({ reducer: { jobs: jobReducer }, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';

export { renderWithRedux };
