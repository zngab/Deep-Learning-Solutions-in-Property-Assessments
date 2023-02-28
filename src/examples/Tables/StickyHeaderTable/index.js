import React, { useState } from "react";
// import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

const StickyHeaderTable = ({ columns, rows }) => {
  // columns is an array of objects with below structure: (example)
  // [
  //  {
  //    id: "id",
  //    label: "Id", could be pure string or unicode like "***\u00a0***"
  //    minWidth: 120,
  //    align: "right",
  //    format: (value)=>value.toLocaleString("en-US"),
  //  },
  //  {
  //    id: "age",
  //    label: "Age", could be pure string or unicode like "***\u00a0***"
  //    minWidth: 50,
  //    align: "center",
  //    format: (value)=>value.toFixed(0),
  //  },
  //  ...
  // ]

  // rows is an array of objects with below structure: (assume above example)
  // [
  //  {
  //    id: "***",
  //    age: 20,
  //    ***
  //  }
  // ]

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    // <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <ArgonBox my={3}>
      <Card>
        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <ArgonTypography variant="h6">Sales Table</ArgonTypography>
        </ArgonBox>
        <ArgonBox
          sx={{
            "& .MuiTableRow-root:not(:last-child)": {
              "& td": {
                borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              },
            },
            width: "100%",
            overflow: "hidden",
          }}
        >
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ width: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ width: column.minWidth }}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ArgonBox>
      </Card>
    </ArgonBox>
    // </Paper>
  );
};

// Setting default values for the props of StickyHeaderTable
StickyHeaderTable.defaultProps = {
  rows: [{}],
  columns: [{}],
};

// Typechecking props for the StickyHeaderTable
StickyHeaderTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
};

export default StickyHeaderTable;
