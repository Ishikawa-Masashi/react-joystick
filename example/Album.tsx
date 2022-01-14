import React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { Joystick } from '../src/Joystick';
import { ParseError } from 'katex';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://ishikawa-masashi.github.io/">
        Ishikawa Masashi
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const _ = String.raw;

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function renderError(error: ParseError | TypeError) {
  return (
    <p>
      <b>Custom</b> error message: {error.name}
    </p>
  );
}

const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Album() {
  const [value, setValue] = React.useState('y = k * x + c');
  const handleChange = React.useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            react-katex
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Stack
              direction="row"
              spacing={0}
              justifyContent="center"
              alignItems="center"
            >
              <div className="react-icon" />
              <Typography
                component="h1"
                variant="h2"
                // align="center"
                color="text.primary"
                gutterBottom
              >
                React Jyostick
              </Typography>
            </Stack>
            <Typography
              variant="h4"
              align="center"
              color="text.secondary"
              paragraph
            >
              Demo of react-katex
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Dynamic formula
            </Typography>

            <div style={{ width: '500px', height: '500px' }}>
              <Joystick
                start={(evt) => console.log('Started')}
                move={(evt) => console.log(evt)}
                stop={(evt) => console.log('Stopped')}
                // mode={'dynamic'}
                autoCenter={true}
              />
            </div>
            <small>
              You can notice that in the code is written the custom macro (via{' '}
              <code>props.settings</code>) for interpunct so you can use &quot;
              <code>*</code>
              &quot; instead of &quot;
              <code>\cdot</code>
              &quot;.
            </small>
            <small>
              You can notice that in the code is written the custom macro (via{' '}
              <code>props.settings</code>) for interpunct so you can use &quot;
              <code>*</code>
              &quot; instead of &quot;
              <code>\cdot</code>
              &quot;.
            </small>
            <h2>Inline math</h2>
            <h2>Block math</h2>
            <span>
              via <code>props.children</code>:
            </span>
            <span>
              via <code>props.math</code>:
            </span>
            <h2>Error handling</h2>
            <span>
              <code>props.errorColor</code>:
            </span>
            <span>
              <code>props.renderError</code>:
            </span>
            <span>simple expression:</span>
            <h2>Custom wrapper component</h2>
          </Container>
        </Box>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          {/* Copyright © 2021 Ishikawa Masashi. */}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          {/* Something here to give the footer a purpose! */}
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
