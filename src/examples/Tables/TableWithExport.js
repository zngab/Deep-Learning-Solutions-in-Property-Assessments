/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import PropTypes from "prop-types";
import generateExcel from "zipcelx";

const TableWithExport = ({ columns, rows, title }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  function getExcel() {
    const config = {
      filename: "table-exported",
      sheet: {
        data: [],
      },
    };

    const dataSet = config.sheet.data;

    // review with one level nested config
    // HEADERS
    const headerRow = [];
    columns.forEach((column) => {
      if (column) headerRow.push(column);
    });

    dataSet.push(headerRow);

    // FILTERED ROWS
    if (rows.length > 0) {
      rows.forEach((row) => {
        const dataRow = [];

        Object.values(row).forEach((value) =>
          dataRow.push({
            value,
            type: typeof value === "number" ? "number" : "string",
          })
        );

        dataSet.push(dataRow);
      });
    } else {
      dataSet.push([
        {
          value: "No data",
          type: "string",
        },
      ]);
    }

    return generateExcel(config);
  }

  return (
    <Grid container>
      <Grid item xl={12}>
        <ArgonBox>
          <ArgonTypography
            variant="h6"
            color="text"
            fontWeight="medium"
            sx={{ my: 1 }}
            align="center"
          >
            {title}
          </ArgonTypography>
        </ArgonBox>
      </Grid>
      <Grid item xl={12} sx={{ width: "100%", overflow: "hidden" }}>
        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <ArgonTypography variant="h6">{title}</ArgonTypography>
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
      </Grid>
      <Grid item xl={12}>
        <ArgonBox m={3}>
          <Button variant="gradient" color="primary" onClick={getExcel}>
            Export to Excel
          </Button>
        </ArgonBox>
      </Grid>
    </Grid>
  );
};

TableWithExport.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};
export default TableWithExport;
