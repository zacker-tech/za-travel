import { Outlet, useLocation } from 'react-router-dom';

import { Box, Grid } from '@mui/material';

import LoginBackground from '@features/auth/assets/login-background.png';
import SignUpBackground from '@features/auth/assets/sign-up-background.png';

import Logo from '../logo/Logo';

export default function AuthLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Grid
      container
      component="main"
      sx={{
        minHeight: { md: '100vh' },
        height: { xs: '100vh', md: 'auto' },
        maxHeight: { xs: '-webkit-fill-available', md: 'auto' },
      }}
    >
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: `url(${
            isLoginPage ? LoginBackground : SignUpBackground
          })`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopRightRadius: 56,
          borderBottomRightRadius: 56,
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            height: '100%',
            mx: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 552,
          }}
        >
          <Box mb={4}>
            <Logo />
          </Box>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}
