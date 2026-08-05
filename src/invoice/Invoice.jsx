import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import axios from 'axios';

const ITEM_OPTIONS = [
  'Web Design Services',
  'Consulting Hours',
  'Hosting (Monthly)',
  'Logo Design',
  'Maintenance & Support',
];

let nextId = 2;

function formatCurrency(value) {
  const n = Number(value) || 0;
  return `$${n.toFixed(2)}`;
}

function emptyRow(sNo) {
  return {
    id: nextId++,
    sNo,
    item: '',
    description: '',
    qty: '',
    rate: '',
    disc: '',
  };
}

function rowAmount(row) {
  const qty = Number(row.qty) || 0;
  const rate = Number(row.rate) || 0;
  const disc = Number(row.disc) || 0;
  const gross = qty * rate;
  return gross - (gross * disc) / 100;
}

export default function InvoiceForm({ initialInvoice = null, onSave, saving = false }) {
  const isUpdateMode = Boolean(initialInvoice);

  const [invoiceNo, setInvoiceNo] = React.useState(initialInvoice?.invoiceNo || '');
  const [invoiceDate, setInvoiceDate] = React.useState(initialInvoice?.invoiceDate || '2025-01-15');
  const [customerName, setCustomerName] = React.useState(initialInvoice?.customerName || '');
  const [city, setCity] = React.useState(initialInvoice?.city || '');
  const [address, setAddress] = React.useState(initialInvoice?.address || '');
  const [notes, setNotes] = React.useState(initialInvoice?.notes || '');

  const [rows, setRows] = React.useState(() => {
    if (initialInvoice?.lineItems?.length) {
      return initialInvoice.lineItems.map((li, idx) => ({
        id: nextId++,
        sNo: idx + 1,
        item: li.item || '',
        description: li.description || '',
        qty: li.qty ?? '',
        rate: li.rate ?? '',
        disc: li.disc ?? '',
      }));
    }
    return [{ id: nextId++, sNo: 1, item: '', description: '', qty: '', rate: '', disc: '' }];
  });
  const [selectedRowId, setSelectedRowId] = React.useState(rows[0]?.id ?? null);

  const [taxPercent, setTaxPercent] = React.useState(initialInvoice?.taxPercent ?? '');

  // If a different invoice is loaded later (e.g. navigating from one edit
  // screen to another without unmounting), re-sync the form fields.
  const initialInvoiceId = initialInvoice?.id ?? initialInvoice?._id ?? null;
  React.useEffect(() => {
    if (!initialInvoice) return;
    setInvoiceNo(initialInvoice.invoiceNo || '');
    setInvoiceDate(initialInvoice.invoiceDate || '2025-01-15');
    setCustomerName(initialInvoice.customerName || '');
    setCity(initialInvoice.city || '');
    setAddress(initialInvoice.address || '');
    setNotes(initialInvoice.notes || '');
    setTaxPercent(initialInvoice.taxPercent ?? '');
    const newRows = initialInvoice.lineItems?.length
      ? initialInvoice.lineItems.map((li, idx) => ({
          id: nextId++,
          sNo: idx + 1,
          item: li.item || '',
          description: li.description || '',
          qty: li.qty ?? '',
          rate: li.rate ?? '',
          disc: li.disc ?? '',
        }))
      : [{ id: nextId++, sNo: 1, item: '', description: '', qty: '', rate: '', disc: '' }];
    setRows(newRows);
    setSelectedRowId(newRows[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialInvoiceId]);

  const subtotal = rows.reduce((sum, row) => sum + rowAmount(row), 0);
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const invoiceAmount = subtotal + taxAmount;

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    setRows((prev) => {
      const newRow = emptyRow(prev.length + 1);
      setSelectedRowId(newRow.id);
      return [...prev, newRow];
    });
  };

  const handleCopyRow = () => {
    setRows((prev) => {
      const source = prev.find((r) => r.id === selectedRowId) || prev[prev.length - 1];
      if (!source) return prev;
      const copy = { ...source, id: nextId++, sNo: prev.length + 1 };
      setSelectedRowId(copy.id);
      return [...prev, copy];
    });
  };

  const handleDeleteRow = () => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev
        .filter((r) => r.id !== selectedRowId)
        .map((r, idx) => ({ ...r, sNo: idx + 1 }));
      setSelectedRowId(filtered[filtered.length - 1]?.id ?? null);
      return filtered;
    });
  };

  const handleDeleteSingleRow = (id) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, sNo: idx + 1 }));
      if (selectedRowId === id) {
        setSelectedRowId(filtered[filtered.length - 1]?.id ?? null);
      }
      return filtered;
    });
  };

const handleSave = async () => {
  const payload = {
    invoiceNo: Number(invoiceNo),
    invoiceDate: new Date(invoiceDate).toISOString(),
    customerName,
    address,
    city,
    taxPercentage: Number(taxPercent) || 0,
    notes,

    lines: rows.map((row) => ({
      rowNo: row.sNo,
      itemID: Number(row.item),
      description: row.description,
      quantity: Number(row.qty),
      rate: Number(row.rate),
      discountPct: Number(row.disc) || 0,
    })),
  };

  console.log(payload);

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "https://alitinvoiceappapi.azurewebsites.net/api/Invoice",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    onSave?.(response.data);
  } catch (err) {
    console.log(err.response?.data || err);
  }
};

  return (
    <Box sx={{ bgcolor: '#f5f6f8', minHeight: '100vh', p: { xs: 2, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Invoice Details */}
        <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5 }}>
            {isUpdateMode ? 'Edit Invoice' : 'Invoice Details'}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: 3,
              rowGap: 2.5,
            }}
          >
            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>Invoice No</FormLabel>
              <TextField
                size="small"
                placeholder="INV-001"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Auto next available number
              </Typography>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                Invoice Date <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </FormLabel>
              <TextField
                size="small"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                Customer Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </FormLabel>
              <TextField
                size="small"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>City</FormLabel>
              <TextField
                size="small"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>Address</FormLabel>
              <TextField
                size="small"
                placeholder="Enter address"
                multiline
                minRows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '0.8rem', mb: 0.5 }}>Notes</FormLabel>
              <TextField
                size="small"
                placeholder="Additional notes"
                multiline
                minRows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
          </Box>
        </Card>

        {/* Line Items */}
        <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Line Items
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={handleAddRow}>
                + Add Row
              </Button>
              <Button size="small" variant="outlined" onClick={handleCopyRow}>
                ⧉ Copy
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleDeleteRow}
                disabled={rows.length <= 1}
              >
                🗑 Delete
              </Button>
            </Box>
          </Box>

          {/* Table header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '40px 160px 1fr 90px 90px 90px 100px 32px',
              gap: 1.5,
              px: 1,
              pb: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              S.No
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Item *
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Description
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right' }}>
              Qty *
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right' }}>
              Rate *
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right' }}>
              Disc %
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'right' }}>
              Amount
            </Typography>
            <span />
          </Box>
          <Divider />

          {rows.map((row) => (
            <Box
              key={row.id}
              onClick={() => setSelectedRowId(row.id)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '40px 160px 1fr 90px 90px 90px 100px 32px',
                gap: 1.5,
                alignItems: 'center',
                px: 1,
                py: 1,
                borderRadius: 1,
                bgcolor: selectedRowId === row.id ? 'action.selected' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {row.sNo}
              </Typography>

              <Select
                size="small"
                displayEmpty
                value={row.item}
                onChange={(e) => updateRow(row.id, 'item', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem value="">
                  <em style={{ color: '#9aa0a6', fontStyle: 'normal' }}>Select item...</em>
                </MenuItem>
                {ITEM_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                size="small"
                placeholder="Description"
                value={row.description}
                onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />

              <TextField
                size="small"
                type="number"
                placeholder="0.00"
                value={row.qty}
                onChange={(e) => updateRow(row.id, 'qty', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                inputProps={{ style: { textAlign: 'right' } }}
              />

              <TextField
                size="small"
                type="number"
                placeholder="0.00"
                value={row.rate}
                onChange={(e) => updateRow(row.id, 'rate', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                inputProps={{ style: { textAlign: 'right' } }}
              />

              <TextField
                size="small"
                type="number"
                placeholder="0.00"
                value={row.disc}
                onChange={(e) => updateRow(row.id, 'disc', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                inputProps={{ style: { textAlign: 'right' } }}
              />

              <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 500 }}>
                {formatCurrency(rowAmount(row))}
              </Typography>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSingleRow(row.id);
                }}
                disabled={rows.length <= 1}
              >
                <Typography sx={{ fontSize: '1.1rem', lineHeight: 1, color: 'text.secondary' }}>×</Typography>
              </IconButton>
            </Box>
          ))}

          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, px: 1, py: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Subtotal:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>
        </Card>

        {/* Invoice Totals */}
        <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5 }}>
            Invoice Totals
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: { xs: '100%', sm: 340 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Sub Total</Typography>
                <Box
                  sx={{
                    minWidth: 140,
                    textAlign: 'right',
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.75,
                  }}
                >
                  <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Tax</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    placeholder="0.00"
                    sx={{ width: 90 }}
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      },
                    }}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                  <TextField
                    size="small"
                    value={formatCurrency(taxAmount)}
                    sx={{ width: 90 }}
                    InputProps={{ readOnly: true }}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                </Box>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Invoice Amount</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {formatCurrency(invoiceAmount)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving}
            sx={{ px: 5 }}
          >
            {saving ? 'Saving...' : isUpdateMode ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}