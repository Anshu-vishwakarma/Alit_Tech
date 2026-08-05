import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import NewItemDialog from "./NewItemDialog";
import {
  SearchIcon,
  AddIcon,
  FileDownloadOutlinedIcon,
  ViewColumnOutlinedIcon,
  ImageOutlinedIcon,
  EditOutlinedIcon,
  DeleteOutlineIcon,
  UnfoldMoreIcon,
  ArrowUpwardIcon,
  ArrowDownwardIcon,
} from "./icons";



const HeaderCell = ({ children, sx, sortKey, sortConfig, onSort, align = "left" }) => {
  const isActive = sortConfig.key === sortKey;
  return (
    <TableCell
      onClick={() => onSort(sortKey)}
      sx={{
        color: "text.secondary",
        fontSize: 13,
        fontWeight: 500,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        userSelect: "none",
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        justifyContent={align === "right" ? "flex-end" : "flex-start"}
      >
        <span>{children}</span>
        {isActive ? (
          sortConfig.direction === "asc" ? (
            <ArrowUpwardIcon style={{ fontSize: 15, color: "#2b2f36" }} />
          ) : (
            <ArrowDownwardIcon style={{ fontSize: 15, color: "#2b2f36" }} />
          )
        ) : (
          <UnfoldMoreIcon style={{ fontSize: 15, color: "#9aa0a6" }} />
        )}
      </Stack>
    </TableCell>
  );
};

export default function ItemsTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.title) return data.title;
    if (data.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstMsg = data.errors[firstKey]?.[0];
      return firstMsg || data.title || fallback;
    }
    return fallback;
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://alitinvoiceappapi.azurewebsites.net/api/item/getlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data ?? []);
    } catch (err) {
      setAlertType("error");
      setAlertMessage(getErrorMessage(err, "Failed to load items."));
      setOpenSnackbar(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${"https://alitinvoiceappapi.azurewebsites.net/api/Item"}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertType("success");
      setAlertMessage("Item deleted.");
      setOpenSnackbar(true);
      fetchItems();
    } catch (err) {
      setAlertType("error");
      setAlertMessage(getErrorMessage(err, "Failed to delete item."));
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (item) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    fetchItems();
    setEditingItem(null);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setPage(1);
  };

  const filteredItems = items.filter((item) =>
    (item.itemName || "").toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    const sorted = [...filteredItems].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredItems, sortConfig]);

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + rowsPerPage);
  const pageCount = Math.max(1, Math.ceil(sortedItems.length / rowsPerPage));
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        bgcolor: "#fff",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Items
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Manage your product and service catalog.
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: '100%', mb: 3 }}
      >
        <TextField
          placeholder="Search items..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ width: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ fontSize: 18, color: "#9aa0a6" }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1.5} sx={{ marginLeft: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              bgcolor: "#2b2f36",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#20232a", boxShadow: "none" },
            }}
          >
            Add New Item
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{ textTransform: "none", borderColor: "divider", color: "text.primary" }}
          >
            Export
          </Button>
          <IconButton sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}>
            <ViewColumnOutlinedIcon style={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>
                Picture
              </TableCell>
              <HeaderCell sortKey="itemName" sortConfig={sortConfig} onSort={handleSort}>
                Item Name
              </HeaderCell>
              <HeaderCell sortKey="description" sortConfig={sortConfig} onSort={handleSort}>
                Description
              </HeaderCell>
              <HeaderCell
                sortKey="salesRate"
                sortConfig={sortConfig}
                onSort={handleSort}
                align="right"
                sx={{ textAlign: "right" }}
              >
                Sale Rate
              </HeaderCell>
              <HeaderCell
                sortKey="discountPct"
                sortConfig={sortConfig}
                onSort={handleSort}
                align="right"
                sx={{ textAlign: "right" }}
              >
                Discount %
              </HeaderCell>
              <TableCell
                align="right"
                sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No items found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems?.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={item.picture || undefined}
                      sx={{ bgcolor: "#f1f2f4", width: 36, height: 36 }}
                    >
                      {!item.picture && <ImageOutlinedIcon style={{ color: "#9aa0a6", fontSize: 18 }} />}
                    </Avatar>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{item.itemName}</TableCell>
                  <TableCell sx={{ color: "text.secondary", maxWidth: 380 }}>
                    {item.description}
                  </TableCell>
                  <TableCell align="right">${Number(item?.salesRate).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(item?.discountPct).toFixed(2)}%</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEditDialog(item)}>
                      <EditOutlinedIcon style={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item?.itemID)}>
                      <DeleteOutlineIcon style={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ mt: 2, width: '100%' }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 64 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Stack>

        <Box sx={{ marginLeft: 'auto' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
          />
        </Box>
      </Stack>

      <NewItemDialog
        open={dialogOpen}
        item={editingItem}
        onClose={handleCloseDialog}
        onSave={handleSaveItem}
      />

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
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}