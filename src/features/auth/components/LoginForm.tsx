import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router-dom';

import { Box, Link, Stack, TextField, Typography } from '@mui/material';

import { AppRoutes } from '@config/routes';
import AppButton from '@features/ui/AppButton';
import { useAppDispatch, useAppSelector } from '@store/index';

import { loginUser } from '../store/authActions';
import { selectAuth } from '../store/authSlice';

interface FormInput {
  email: string;
  password: string;
}

export default function LoginForm() {
  const auth = useAppSelector(selectAuth);
  const { handleSubmit, control, onSubmit } = useLoginForm();
  const location = useLocation();

  if (auth.user) {
    // Send them back to the page they tried to visit when they were
    // redirected to the login page.
    const from = location.state?.from?.pathname || AppRoutes.dashboard;
    return <Navigate to={from} replace />;
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%' }}
    >
      <Controller
        name="email"
        control={control}
        rules={{ required: 'Please specify email address!' }}
        render={({ field, fieldState }) => (
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            helperText={fieldState.error?.message}
            error={Boolean(fieldState.error)}
            sx={{ mb: 3, mt: 0 }}
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: 'Please specify your password!' }}
        render={({ field, fieldState }) => (
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            helperText={fieldState.error?.message}
            error={Boolean(fieldState.error)}
            sx={{ mb: { xs: 3, md: 5 }, mt: 0 }}
            {...field}
          />
        )}
      />
      <AppButton
        loading={auth.status === 'loading'}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mb: 2 }}
      >
        Login
      </AppButton>
      <Stack
        justifyContent="center"
        direction="row"
        spacing={0.5}
        sx={{ width: '100%' }}
      >
        <Typography color="text.secondary">
          Dont have an account yet?
        </Typography>
        <Link href={AppRoutes.singUp} variant="body2">
          Sign Up
        </Link>
      </Stack>
    </Box>
  );
}

function useLoginForm() {
  const dispatch = useAppDispatch();
  const { handleSubmit, control } = useForm<FormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    dispatch(
      loginUser({
        email: data.email,
        password: data.password,
      }),
    );
  };

  return {
    handleSubmit,
    control,
    onSubmit,
  };
}
