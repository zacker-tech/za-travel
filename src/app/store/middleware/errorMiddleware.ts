import { enqueueSnackbar } from 'notistack';

import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action) || 'error' in action) {
    enqueueSnackbar(
      action.payload ?? action.error?.message ?? 'Something went wrong!',
      {
        variant: 'error',
      },
    );
  }

  return next(action);
};
