import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { CloseIcon, ImageOutlinedIcon } from "./icons";

const DESCRIPTION_MAX = 500;
const API_BASE = "https://alitinvoiceappapi.azurewebsites.net/api/item";

const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data;

  if (!data) {
    return err?.message || fallback;
  }

  if (typeof data === "string") return data;

  if (data.errors && typeof data.errors === "object") {
    const allMessages = Object.entries(data.errors)
      .flatMap(([field, msgs]) =>
        Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : [`${field}: ${msgs}`]
      );
    if (allMessages.length) return allMessages.join(" | ");
  }

  if (data.title || data.detail) {
    return [data.title, data.detail].filter(Boolean).join(" — ");
  }

  return fallback;
};

function RequiredLabel({ htmlFor, children }) {
  return (
    <FormLabel sx={{ alignSelf: 'flex-start' }} htmlFor={htmlFor}>
      {children} <Box component="span" sx={{ color: 'error.main' }}>*</Box>
    </FormLabel>
  );
}


export default function NewItemDialog({ open, onClose, onSave, item = null }) {
  const isEditMode = Boolean(item?.id);

  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const [descriptionValue, setDescriptionValue] = React.useState('');

  const [salesRateError, setsalesRateError] = React.useState(false);
  const [salesRateErrorMessage, setsalesRateErrorMessage] = React.useState('');

  const [discountError, setDiscountError] = React.useState(false);
  const [discountErrorMessage, setDiscountErrorMessage] = React.useState('');

  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertType, setAlertType] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");

  React.useEffect(() => {
    if (!open) return;

    if (item) {
      setDescriptionValue(item.description || '');
      setPreview(item.picture || null);
      setFile(null);
    } else {
      setDescriptionValue('');
      setPreview(null);
      setFile(null);
    }

    setSubmitError('');
    setNameError(false);
    setsalesRateError(false);
    setDiscountError(false);
    setNameErrorMessage('');
    setsalesRateErrorMessage('');
    setDiscountErrorMessage('');
  }, [open, item]);

  const validateInputs = () => {
    if (nameError || salesRateError || discountError) {
      setSubmitError("Please fix the validation errors before saving.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setDescriptionValue('');
    setFile(null);
    setPreview(null);

    setSubmitError('');

    setNameError(false);
    setsalesRateError(false);
    setDiscountError(false);

    setNameErrorMessage('');
    setsalesRateErrorMessage('');
    setDiscountErrorMessage('');
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setAlertType("error");
        setAlertMessage("File must be under 5MB.");
        setOpenSnackbar(true);
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    const data = new FormData(event.currentTarget);

    const isValid = validateInputs();

    if (!isValid) {
      setAlertType("error");
      setAlertMessage("Please fix the highlighted fields before saving.");
      setOpenSnackbar(true);
      return;
    }

    const payload = {
      itemName: data.get("itemName"),
      description: data.get("description"),
      salesRate: Number(data.get("salesRate")),
      discountPct: Number(data.get("discount") || 0),
    };

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let response;
      if (isEditMode) {
     
        response = await axios.put(`${API_BASE}/${item.itemID}`, { id: item.itemID, ...payload }, { headers });
      } else {
        response = await axios.post(API_BASE, payload, { headers });
      }

      event.target.reset();
      resetForm();

      setAlertType("success");
      setAlertMessage(isEditMode ? "Item updated successfully." : "Item saved successfully.");
      setOpenSnackbar(true);

      onSave?.(response.data);
      onClose?.();
    } catch (err) {
      console.log(err);
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);

      setAlertType("error");
      setAlertMessage(getErrorMessage(err, isEditMode ? "Failed to update item." : "Something went wrong."));
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditMode ? 'Edit Item' : 'New Item'}
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon style={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <Divider />

      
      <Box key={item?.id || 'new'} component="form" onSubmit={handleSave} noValidate>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Item Picture
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 1.5,
                    bgcolor: '#f5f5f6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {preview ? (
                    <Box
                      component="img"
                      src={preview}
                      alt="Preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1.5 }}
                    />
                  ) : (
                    <>
                      <ImageOutlinedIcon style={{ fontSize: 20 }} />
                      <Typography variant="caption" sx={{ fontSize: 10, mt: 0.5 }}>
                        Preview
                      </Typography>
                    </>
                  )}
                </Box>

                <Stack spacing={0.5}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      color: 'text.primary',
                      borderColor: 'divider',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {file ? file.name : 'No file chosen'}
                    <input type="file" accept="image/png, image/jpeg" hidden onChange={handleFileChange} />
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    PNG or JPG, max 5MB
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <FormControl>
              <RequiredLabel htmlFor="itemName">Item Name</RequiredLabel>
              <TextField
                name="itemName"
                required
                fullWidth
                size="small"
                id="itemName"
                placeholder="Enter item name"
                defaultValue={item?.itemName || ''}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setNameError(true);
                    setNameErrorMessage("Item name is required.");
                  } else {
                    setNameError(false);
                    setNameErrorMessage("");
                  }
                }}
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ alignSelf: 'flex-start' }} htmlFor="description">
                Description
              </FormLabel>
              <TextField
                name="description"
                fullWidth
                multiline
                minRows={3}
                id="description"
                placeholder="Enter item description"
                value={descriptionValue}
                onChange={(e) =>
                  e.target.value.length <= DESCRIPTION_MAX && setDescriptionValue(e.target.value)
                }
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
              >
                {descriptionValue.length}/{DESCRIPTION_MAX}
              </Typography>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <RequiredLabel htmlFor="salesRate">Sale Rate</RequiredLabel>
                <TextField
                  name="salesRate"
                  required
                  fullWidth
                  size="small"
                  type="number"
                  id="salesRate"
                  placeholder="0.00"
                  defaultValue={item?.salesRate ?? ''}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === '' || isNaN(value) || Number(value) < 0) {
                      setsalesRateError(true);
                      setsalesRateErrorMessage("Enter a valid sale rate.");
                    } else {
                      setsalesRateError(false);
                      setsalesRateErrorMessage("");
                    }
                  }}
                  error={salesRateError}
                  helperText={salesRateErrorMessage}
                  color={salesRateError ? 'error' : 'primary'}
                  inputProps={{ style: { textAlign: 'right' } }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel sx={{ alignSelf: 'flex-start' }} htmlFor="discount">
                  Discount %
                </FormLabel>
                <TextField
                  name="discount"
                  fullWidth
                  size="small"
                  type="number"
                  id="discount"
                  placeholder="0"
                  defaultValue={item?.discountPct ?? ''}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== '' && (isNaN(value) || Number(value) < 0 || Number(value) > 100)) {
                      setDiscountError(true);
                      setDiscountErrorMessage("Discount must be between 0 and 100.");
                    } else {
                      setDiscountError(false);
                      setDiscountErrorMessage("");
                    }
                  }}
                  error={discountError}
                  helperText={discountErrorMessage}
                  color={discountError ? 'error' : 'primary'}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ style: { textAlign: 'right' } }}
                />
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none', color: 'text.primary' }} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: '#2b2f36',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#20232a', boxShadow: 'none' },
            }}
          >
            {isSubmitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Box>

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
    </Dialog>
  );
}