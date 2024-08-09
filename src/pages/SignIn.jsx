import * as React from 'react';
import {useContext, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import useApi from "../hooks/useApi.jsx";
import {useNavigate} from "react-router-dom";
import {DiaryStateContext} from "../App.jsx";
import axiosInstance from "../api/axiosConfig.jsx";

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

const defaultTheme = createTheme({
  palette: {
    red: {
      main: '#ff0000', // 빨강
      contrastText: '#ffffff',
    },
    black: {
      main: '#000000', // 검정
      contrastText: '#ffffff',
    },
    green: {
      main: '#00ff00', // 초록
      contrastText: '#000000',
    },
    yellow: {
      main: '#ffff00', // 노랑
      contrastText: '#000000',
    },
  },
});

export default function SignIn() {
  const {setLoginSuccess, setAuthChecked} = useContext(DiaryStateContext);
  const {response, error, fetchData} = useApi('/login',
      'post');
  const nav = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const apiData = {
      userId: formData.get('id'),
      password: formData.get('password'),
      socialType: 'NONE'
    };

    //로그인 요청
    fetchData({method: 'post', data: apiData});
  };

  const oauth2Login = (provider) => {
    // fetchData({method: 'get', url: "/oauth2/authorization/" + provider});
    window.location.href = "http://localhost:9001/oauth2/authorization/"
        + provider;
  }

  useEffect(() => {
    //로그인 요청이 정상이면 메인페이지로 이동
    if (response && response.status === 200) {
      axiosInstance.defaults.headers.common['Authorization'] = response.headers.authorization;
      localStorage.setItem("id", response.data.id);
      setLoginSuccess(true);
      setAuthChecked(true);
      nav("/", {replace: true});
      return;
    }
    //로그인 요청이 오류이면 오류페이지로 이동
    if (error) {
      // console.log(error.message)
      alert("[" + error.response.status + "] " + error.response.data);
      return;
    }
  }, [response, error]);

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
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate
                 sx={{mt: 1}}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="id"
                  label="id"
                  name="id"
                  autoComplete="id"
                  autoFocus
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
              />
              <FormControlLabel
                  control={<Checkbox value="remember" color="primary"/>}
                  label="Remember me"
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 1, mb: 1}}
              >
                Sign In
              </Button>
              <Button
                  // type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 1, mb: 1}}
                  color="red"
                  onClick={() => {
                    oauth2Login("google")
                  }}
              >
                Google Login
              </Button>
              <Button
                  // type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 1, mb: 1}}
                  color="green"
                  onClick={() => {
                    oauth2Login("naver")
                  }}
              >
                Naver Login
              </Button>
              <Button
                  // type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 1, mb: 1}}
                  color="yellow"
                  onClick={() => {
                    oauth2Login("kakao")
                  }}
              >
                Kakao Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{mt: 8, mb: 4}}/>
        </Container>
      </ThemeProvider>
  );
}
