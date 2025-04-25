import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import FolderIcon from "@mui/icons-material/Folder";
import Layout from "../../components/layout/Layout";
import { useUserProfile } from "../../hooks/useUserProfile";
import useSurveyHistory from "../../hooks/useSurveyHistory";
import useAuth from "../../hooks/useAuth";
import usePersonasAI from "../../hooks/usePersonasAI";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontWeight: 700,
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
}));

const FileTypeChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  "& .MuiChip-label": {
    paddingLeft: 4,
    paddingRight: 4,
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(8),
  textAlign: "center",
}));

const History: React.FC = () => {
  const { history, loadHistory, downloadHistoryItem, error } = useUserProfile();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { surveyHistory } = useSurveyHistory();
  const { profile } = useAuth();
  const { models } = usePersonasAI();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await loadHistory();
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [loadHistory]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = (fileUrl: string) => {
    downloadHistoryItem(fileUrl);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredHistory = history.filter((item) => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    switch (extension) {
      case "pdf":
        return "PDF";
      case "docx":
        return "DOCX";
      case "xlsx":
        return "XLSX";
      case "txt":
        return "TXT";
      default:
        return "FILE";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Response History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and download your past survey responses
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <Tooltip title="Sort">
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <SortIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filter">
                  <IconButton size="small">
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {filteredHistory.length > 0 ? (
          <Paper
            sx={{ width: "100%", overflow: "hidden", borderRadius: 2, mb: 4 }}
          >
            <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>AI Model</StyledTableCell>
                    {/* <StyledTableCell>Personas</StyledTableCell> */}
                    <StyledTableCell>Tokens Used</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                {profile?.planType != "premium" && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="caption" fontWeight={500}>
                          Upgrade to a premium plan to enable saving and
                          accessing your survey files.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                <TableBody>
                  {surveyHistory
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" fontWeight={500}>
                              {item.fileName}
                            </Typography>
                          </Box>
                          {/* <FileTypeChip
                            size="small"
                            label={getFileTypeFromUrl(item.fileUrl)}
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          /> */}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {
                              models.find(
                                (model) => model.id === item.modelUsed
                              )?.name
                            }
                          </Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography variant="body2">
                            {item.personasUsed.length} personas
                          </Typography>
                        </TableCell> */}
                        <TableCell>
                          <Typography variant="body2">
                            {item.tokensUsed} tokens
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              color="primary"
                              sx={{ mr: 1 }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleDownload(item.filePath)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={surveyHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        ) : (
          <EmptyStateContainer>
            <FolderIcon sx={{ fontSize: 60, color: "primary.light", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Responses Yet
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              {searchTerm
                ? "No results match your search"
                : "Generate your first response to see your history"}
            </Typography>
            {searchTerm ? (
              <Button variant="outlined" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            ) : (
              <Button variant="contained" color="primary" href="/dashboard">
                Create New Response
              </Button>
            )}
          </EmptyStateContainer>
        )}
      </Container>
    </Layout>
  );
};

export default History;
