import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import axios from 'axios';
import MuiLink from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
    maxWidth: '900px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100vw',
  justifyContent: 'center',
  alignItems: 'center',
  overflowX: 'hidden',
  overflowY: 'auto',
  boxSizing: 'border-box',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function RequiredLabel({ htmlFor, children }) {
  return (
    <FormLabel sx={{ alignSelf: 'flex-start' }} htmlFor={htmlFor}>
      {children} <Box component="span" sx={{ color: 'error.main' }}>*</Box>
    </FormLabel>
  );
}

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: 'inherit' };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 20, label: 'Weak', color: 'error' };
  if (score <= 3) return { score: 60, label: 'Medium', color: 'warning' };
  return { score: 100, label: 'Strong', color: 'success' };
}

export default function SignUp(props) {
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [companyNameError, setCompanyNameError] = React.useState(false);
  const [companyNameErrorMessage, setCompanyNameErrorMessage] = React.useState('');
  const [addressError, setAddressError] = React.useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = React.useState('');
  const [cityError, setCityError] = React.useState(false);
  const [cityErrorMessage, setCityErrorMessage] = React.useState('');
  const [zipError, setZipError] = React.useState(false);
  const [zipErrorMessage, setZipErrorMessage] = React.useState('');
  const [industryError, setIndustryError] = React.useState(false);
  const [industryErrorMessage, setIndustryErrorMessage] = React.useState('');
  const [currencyError, setCurrencyError] = React.useState(false);
  const [currencyErrorMessage, setCurrencyErrorMessage] = React.useState('');
  const [logoUrl, setLogoUrl] = React.useState('');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [isFormValid, setIsFormValid] = React.useState(false);
  const strength = getPasswordStrength(password);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertType, setAlertType] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");
  const validateInputs = () => {
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      companyNameError ||
      addressError ||
      cityError ||
      zipError ||
      industryError ||
      currencyError
    ) {
      setSubmitError("Please fix the validation errors before submitting the form.");
      return false;
    }

    return true;
  };
  const resetForm = () => {
    setPassword("");
    setLogoUrl("");

    setSubmitError("");

    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setCompanyNameError(false);
    setAddressError(false);
    setCityError(false);
    setZipError(false);
    setIndustryError(false);
    setCurrencyError(false);

    setFirstNameErrorMessage("");
    setLastNameErrorMessage("");
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    setCompanyNameErrorMessage("");
    setAddressErrorMessage("");
    setCityErrorMessage("");
    setZipErrorMessage("");
    setIndustryErrorMessage("");
    setCurrencyErrorMessage("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    const data = new FormData(event.currentTarget);

    const formData = new FormData();
    formData.append("FirstName", data.get("firstName"));
    formData.append("LastName", data.get("lastName"));
    formData.append("Email", data.get("email"));
    formData.append("Password", data.get("password"));
    formData.append("CompanyName", data.get("companyName"));
    formData.append("logo", data.get("logoUrl"));
    formData.append("Address", data.get("address"));
    formData.append("City", data.get("city"));
    formData.append("ZipCode", data.get("zip"));
    formData.append("Industry", data.get("industry"));
    formData.append("CurrencySymbol", data.get("currency"));

    const isValid = validateInputs();
    console.log(isValid)
    if (!isValid) {
      setAlertType("error");
      setAlertMessage("Please fix the highlighted fields before submitting.");
      setOpenSnackbar(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://alitinvoiceappapi.azurewebsites.net/api/Auth/Signup",
        formData
      );
      console.log("Success:", response.data);

      event.target.reset();
      resetForm();
      setAlertType("success");
      setAlertMessage("Account created successfully.");
      setOpenSnackbar(true);
    } 
    catch (err) {
  setAlertType("error");
  setAlertMessage(err.response?.data || "Something went wrong.");
  setOpenSnackbar(true);
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
      <SignUpContainer>
        <Card variant="outlined" >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, mb: 5 }}>
            <Typography
              component="h2"
              variant="h2"
              sx={{ textAlign: 'center', width: '100%', }}
            >
              Create Your Account
            </Typography>
            <Typography
              sx={{ textAlign: 'center', width: '100%', }}
            >
              Set up your company and start invoicing in minutes.                   </Typography>

          </Box>


          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
            <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
              {/*  personal info */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Your details
                  </Typography>
                  <FormControl>
                    <RequiredLabel htmlFor="firstName">First name</RequiredLabel>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      placeholder="Jon"
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setFirstNameError(true);
                          setFirstNameErrorMessage("First name is required.");
                        } else {
                          setFirstNameError(false);
                          setFirstNameErrorMessage("");
                        }
                      }}
                      error={firstNameError}
                      helperText={firstNameErrorMessage}
                      color={firstNameError ? 'error' : 'primary'}
                    />
                  </FormControl>
                  <FormControl>
                    <RequiredLabel htmlFor="lastName">Last name</RequiredLabel>
                    <TextField
                      autoComplete="family-name"
                      name="lastName"
                      required
                      fullWidth
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setLastNameError(true);
                          setLastNameErrorMessage("Last name is required.");
                        } else {
                          setLastNameError(false);
                          setLastNameErrorMessage("");
                        }
                      }}
                      id="lastName"
                      placeholder="Snow"
                      error={lastNameError}
                      helperText={lastNameErrorMessage}
                      color={lastNameError ? 'error' : 'primary'}
                    />
                  </FormControl>
                  <FormControl>
                    <RequiredLabel htmlFor="email">Email</RequiredLabel>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      placeholder="your@email.com"
                      name="email"
                      autoComplete="email"
                      onBlur={(e) => {
                        if (!/\S+@\S+\.\S+/.test(e.target.value.trim())) {
                          setEmailError(true);
                          setEmailErrorMessage("Enter a valid email address.");
                        } else {
                          setEmailError(false);
                          setEmailErrorMessage("");
                        }
                      }}
                      variant="outlined"
                      error={emailError}
                      helperText={emailErrorMessage}
                      color={emailError ? 'error' : 'primary'}
                    />
                  </FormControl>
                  <FormControl>
                    <RequiredLabel htmlFor="password">Password</RequiredLabel>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      placeholder="••••••"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      variant="outlined"
                      onBlur={(e) => {
                        const passwordRegex =
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

                        if (!passwordRegex.test(e.target.value)) {
                          setPasswordError(true);
                          setPasswordErrorMessage(
                            "Password must contain uppercase, lowercase, number and special character."
                          );
                        } else {
                          setPasswordError(false);
                          setPasswordErrorMessage("");
                        }
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={passwordError}
                      helperText={passwordErrorMessage}
                      color={passwordError ? 'error' : 'primary'}
                    />
                    {password && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={strength.score}
                          color={strength.color}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: `${strength.color}.main`, mt: 0.5, display: 'block' }}
                        >
                          {strength.label}
                        </Typography>
                      </Box>
                    )}
                  </FormControl>
                  {/* <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive updates via email."
                  /> */}
                </Stack>
              </Grid>

              {/*company info */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Company details
                  </Typography>
                  <FormControl>
                    <RequiredLabel htmlFor="companyName">Company name</RequiredLabel>
                    <TextField
                      name="companyName"
                      required
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setCompanyNameError(true);
                          setCompanyNameErrorMessage("Company name is required.");
                        } else {
                          setCompanyNameError(false);
                          setCompanyNameErrorMessage("");
                        }
                      }}
                      fullWidth
                      id="companyName"
                      placeholder="Acme Inc."
                      error={companyNameError}
                      helperText={companyNameErrorMessage}
                      color={companyNameError ? 'error' : 'primary'}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ alignSelf: 'flex-start' }} htmlFor="logoUrl">
                      Company logo{' '}
                      <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                        (optional)
                      </Typography>
                    </FormLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={logoUrl || undefined}
                        sx={{ width: 48, height: 48, bgcolor: 'action.hover' }}
                      >
                        {!logoUrl && 'Co'}
                      </Avatar>
                      <TextField
                        name="logoUrl"
                        fullWidth
                        id="logoUrl"
                        placeholder="Paste logo URL (e.g. via logo.dev)"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                      />
                    </Box>
                  </FormControl>


                  <FormControl>
                    <RequiredLabel htmlFor="address">Address</RequiredLabel>
                    <TextField
                      name="address"
                      required
                      fullWidth
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setAddressError(true);
                          setAddressErrorMessage("Address is required.");
                        } else {
                          setAddressError(false);
                          setAddressErrorMessage("");
                        }
                      }}
                      id="address"
                      placeholder="123 Main Street, Suite 400"
                      error={addressError}
                      helperText={addressErrorMessage}
                      color={addressError ? 'error' : 'primary'}
                    />
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ flex: 2 }}>
                      <RequiredLabel htmlFor="city">City</RequiredLabel>
                      <TextField
                        name="city"
                        required
                        fullWidth
                        id="city"
                        onBlur={(e) => {
                          if (!e.target.value.trim()) {
                            setCityError(true);
                            setCityErrorMessage("City is required.");
                          } else {
                            setCityError(false);
                            setCityErrorMessage("");
                          }
                        }}
                        placeholder="New York"
                        error={cityError}
                        helperText={cityErrorMessage}
                        color={cityError ? 'error' : 'primary'}
                      />
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                      <RequiredLabel htmlFor="zip">Zip</RequiredLabel>
                      <TextField
                        name="zip"
                        required
                        fullWidth
                        id="zip"
                        onBlur={(e) => {
                          if (!/^\d{6}$/.test(e.target.value.trim())) {
                            setZipError(true);
                            setZipErrorMessage("Zip code must be exactly 6 digits.");
                          } else {
                            setZipError(false);
                            setZipErrorMessage("");
                          }
                        }}
                        placeholder="10001"
                        error={zipError}
                        helperText={zipErrorMessage}
                        color={zipError ? 'error' : 'primary'}
                      />
                    </FormControl>
                  </Box>

                  <FormControl error={industryError}>
                    <RequiredLabel htmlFor="industry">Industry</RequiredLabel>
                    <TextField
                      name="industry"
                      required
                      fullWidth
                      id="industry"
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setIndustryError(true);
                          setIndustryErrorMessage("Industry is required.");
                        } else {
                          setIndustryError(false);
                          setIndustryErrorMessage("");
                        }
                      }}
                      placeholder="e.g. Software / SaaS"
                      error={industryError}
                      helperText={industryErrorMessage}
                      color={industryError ? 'error' : 'primary'}
                    />
                  </FormControl>

                  <FormControl error={currencyError}>
                    <RequiredLabel htmlFor="currency">Currency</RequiredLabel>
                    <TextField
                      name="currency"
                      required
                      fullWidth
                      onBlur={(e) => {
                        const value = e.target.value.trim().toUpperCase();
                        e.target.value = value;

                        if (!/^[A-Z]{1,5}$/.test(value)) {
  setCurrencyError(true);
  setCurrencyErrorMessage("Currency must contain up to 5 letters.");
} else {
  setCurrencyError(false);
  setCurrencyErrorMessage("");
}
                      }}
                      id="currency"
                      placeholder="e.g. USD"
                      error={currencyError}
                      helperText={currencyErrorMessage}
                      color={currencyError ? 'error' : 'primary'}
                    />
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, mt: 4 }}>



              <Button type="submit"

                variant="contained" disabled={isSubmitting} sx={{ px: 5 }}>
                {isSubmitting ? 'Saving...' : 'Sign up'}
              </Button>
            </Box>
          </Box>
          <Divider>
            {/* <Typography sx={{ color: 'text.secondary' }}>or</Typography> */}
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to="/SignIn">SignIn</Link>


            </Typography>
          </Box>
        </Card>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={alertType}
            variant="filled"
            sx={{
              width: "100%",
              bgcolor:
                alertType === "success"
                  ? "#2e7d32"
                  : alertType === "error"
                    ? "#d32f2f"
                    : "#ed6c02",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#fff",
              },
            }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </SignUpContainer>
    </AppTheme>
  );
}