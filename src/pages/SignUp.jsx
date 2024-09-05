import * as React from 'react';
import {useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import useApi from "../hooks/useApi.jsx";

function Copyright(props) {
  return (
      <Typography variant="body2" color="text.secondary"
                  align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const {response, error, fetchData} = useApi('/auth/signup', 'post');
  const nav = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    fetchData({
      data: {
        name: formData.get('name'),
        userId: formData.get('id'),
        email: formData.get('email'),
        password: formData.get('password'),
        socialType: 'NONE'
      }
    })
  };

  useEffect(() => {
    if (response && response.status === 200) {
      const responseData = response.data.response;
      alert(responseData.userId + " 회원가입 완료!");
      nav("/signin", {replace: true})
      return;
    }
    //로그인 요청이 오류이면 오류페이지로 이동
    if (error) {
      // console.log(error.message)
      alert("[" + error.response.status + "] " + error.response.data);
      return;
    }
  }, [response]);

  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline/>
          <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit}
                 sx={{mt: 3}}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="name"
                      label="name"
                      name="name"
                      autoComplete="name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="id"
                      label="id"
                      name="id"
                      autoComplete="id"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                  />
                </Grid>
                {/*<Grid item xs={12}>
                  <FormControlLabel
                      control={<Checkbox value="allowExtraEmails"
                                         color="primary"/>}
                      label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>*/}
              </Grid>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 3, mb: 2}}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{mt: 5}}/>
        </Container>
      </ThemeProvider>
  );
}
