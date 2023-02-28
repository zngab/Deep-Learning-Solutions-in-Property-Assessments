import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// @mui material components
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import zipcelx from "zipcelx";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

const DataTable = ({ columns, rows, title }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  function generateRandom() {
    var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  function exportToExcel() {
    // review with one level nested config
    // HEADERS
    const headerRow = [];

    columns.forEach((column) => {
      if (column) headerRow.push({ value: column.headerName, type: "string" });
    });
    // dataSet.push(headerRow);

    // FILTERED ROWS
    const dataRows = [];
    if (rows.length > 0) {
      rows.forEach((row) => {
        const dataRow = [];
        for (let i = 0; i < columns.length; i++) {
          // }
          // Object.values(row).forEach((value) =>
          dataRow.push({
            value: row[columns[i].field],
            type: typeof row[columns[i].field] === "number" ? "number" : "string",
          });
        }
        dataRows.push(dataRow);
      });
    } else {
      dataRows.push([
        {
          value: "No data",
          type: "string",
        },
      ]);
    }

    const config = {
      filename: "table-exported",
      sheet: {
        data: [headerRow, ...dataRows],
      },
    };

    zipcelx(config);
  }

  return (
    // <ArgonBox my={3}>
    <Card>
      <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={2}>
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
          height: 400,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          getRowId={() => generateRandom()}
          columns={columns}
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          rowsPerPageOptions={[10]}
          pagination
        />
      </ArgonBox>

      <ArgonBox m={3}>
        <ArgonButton variant="gradient" color="primary" onClick={exportToExcel}>
          Export to Excel
        </ArgonButton>
      </ArgonBox>
    </Card>
    // </ArgonBox>
  );
};

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  rows: [{}],
  columns: [{}],
  title: "",
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

export default DataTable;
