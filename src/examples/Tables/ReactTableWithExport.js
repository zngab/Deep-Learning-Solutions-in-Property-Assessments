/* eslint-disable react/jsx-key */
import React, { useMemo } from "react";
// import CssBaseline from '@mui/material/CssBaseline';
import CssBaseline from "@mui/material/CssBaseline";
import MaUTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  TableFooter,
  TablePagination,
  Paper,
  IconButton,
  alpha,
  withStyles,
  InputBase,
  Button,
  Grid,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, FirstPage, LastPage } from "@mui/icons-material";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import PropTypes from "prop-types";

import { useTable, useSortBy, usePagination, useBlockLayout, useResizeColumns } from "react-table";
import generateExcel from "zipcelx";

function Table({ columns, hiddenCols, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    rows,

    // pagination stuff
    canPreviousPage,
    canNextPage,
    // pageOptions,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      // filterTypes,
      initialState: { pageIndex: 0, hiddenColumns: hiddenCols, pageSize: 20 },
      disableMultiSort: true,
    },
    // useFilters,
    // useSortBy,
    usePagination,
    useBlockLayout,
    useResizeColumns
  );

  function getHeader(column) {
    console.log(column);
    if (column.totalVisibleHeaderCount === 1) {
      return [
        {
          value: column.Header,
          type: "string",
        },
      ];
    } else {
      const span = [...Array(column.totalVisibleHeaderCount - 1)].map((x) => ({
        value: "",
        type: "string",
      }));
      return [
        {
          value: column.Header,
          type: "string",
        },
        ...span,
      ];
    }
  }

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
    headerGroups.forEach((headerGroup) => {
      const headerRow = [];
      if (headerGroup.headers) {
        headerGroup.headers.forEach((column) => {
          headerRow.push(...getHeader(column));
        });
      }

      dataSet.push(headerRow);
    });

    // FILTERED ROWS
    if (rows.length > 0) {
      rows.forEach((row) => {
        const dataRow = [];

        Object.values(row.values).forEach((value) =>
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

  // Render the UI for your table
  return (
    <ArgonBox>
      <div style={{ overflowX: "auto" }}>
        <MaUTable
          {...getTableProps()}
          size="small" // dense table sizes
        >
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  return (
                    <TableCell
                      {...column.getHeaderProps()}
                      // {...column.getHeaderProps(column.getSortByToggleProps())}
                      align="center"
                    >
                      {column.render("Header")}
                      {/* Use column.getResizerProps to hook up the events correctly */}
                      <div
                        {...column.getResizerProps()}
                        style={{
                          display: "inline-block",
                          background: "red",
                          width: "5px",
                          height: "100%",
                          position: "absolute",
                          right: 0,
                          top: 0,
                          transform: "translateX(50%)",
                          zIndex: 1,
                          touchAction: "none",
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()} align="center">
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[20]}
                component="div"
                count={rows.length}
                rowsPerPage={20}
                page={pageIndex}
                onPageChange={(e, p) => {
                  gotoPage(p);
                }}
                // onRowsPerPageChange={(e) => {
                //   setPageSize(Number(e.target.value));
                // }}
                ActionsComponent={() => (
                  <TablePaginationActions
                    {...{
                      previousPage,
                      nextPage,
                      gotoPage,
                      canPreviousPage,
                      canNextPage,
                      pageCount,
                    }}
                  />
                )}
              />
            </TableRow>
          </TableFooter>
        </MaUTable>
        <ArgonBox m={3}>
          <Button variant="gradient" color="primary" onClick={getExcel}>
            Export to Excel
          </Button>
        </ArgonBox>
      </div>
    </ArgonBox>
  );
}

Table.propTypes = {
  columns: PropTypes.array,
  hiddenCols: PropTypes.array,
  data: PropTypes.arrayOf(PropTypes.object),
};

function TablePaginationActions({
  previousPage,
  nextPage,
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
}) {
  const handleFirstPageButtonClick = () => {
    gotoPage(0);
  };

  const handleBackButtonClick = () => {
    previousPage();
  };

  const handleNextButtonClick = () => {
    nextPage();
  };

  const handleLastPageButtonClick = () => {
    gotoPage(pageCount - 1);
  };

  return (
    <div style={{ flexShrink: 0 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={!canPreviousPage}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={!canPreviousPage}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={!canNextPage} aria-label="next page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={!canNextPage}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  previousPage: PropTypes.function,
  nextPage: PropTypes.function,
  gotoPage: PropTypes.function,
  canPreviousPage: PropTypes.boolean,
  canNextPage: PropTypes.boolean,
  pageCount: PropTypes.number,
};

const ReactTableWithExport = ({ columns, data, filterTypeOfCols = null, title }) => {
  let cols;
  let hiddenCols = [];

  // filterTypeOfCols object has below structure:
  //{
  //    hiddenCols: [],
  //    selectFilters: [],
  //    numberRangeFilters: [],
  //    fuzzyTextFilters: [],
  //    sliderEqualFilters: [],
  //    sliderGreaterThanFilters: [],
  // }
  if (filterTypeOfCols) {
    cols = columns.map((col) => {
      if (filterTypeOfCols.hiddenCols.includes(col.accessor)) {
        hiddenCols.push(col.accessor);
      }
      return col;
    });
  } else cols = columns;

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
      <Grid item xl={12}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "30px",
          }}
        >
          {/* <ArgonBox m={2}> */}

          <CssBaseline />
          <Table columns={cols} hiddenCols={hiddenCols} data={data} />
        </div>
        {/* </ArgonBox> */}
      </Grid>
    </Grid>
  );
};

ReactTableWithExport.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.arrayOf(PropTypes.object),
  filterTypeOfCols: PropTypes.array,
  title: PropTypes.string,
};
export default ReactTableWithExport;
