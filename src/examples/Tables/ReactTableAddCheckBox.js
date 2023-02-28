/* eslint-disable react/jsx-key */

import React, { useState } from "react";
import styled from "styled-components";
import { useTable, useRowSelect } from "react-table";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
//import MUI components
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
//import Argon Components
import ArgonBox from "components/ArgonBox/index";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

const Styles = styled.div`
  padding: 1rem;
  font-family: Sans-serif;
  font-size: 0.8em;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});
IndeterminateCheckbox.defaultProps = {
  indeterminate: false,
};
IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
};

function Table({ columns, data, onChildClick, title }) {
  const handleRowsSelected = (e) => {
    onChildClick(selectedFlatRows);
  };
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Render the UI for your table
  return (
    <ArgonBox m={2}>
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
      <div
        style={{
          // position: 'relative',
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.slice(0, 10).map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <ArgonBox m={3}>
          <Grid container justifyContent="center">
            <ArgonButton variant="gradient" color="primary" onClick={handleRowsSelected}>
              Use Selected Rows
            </ArgonButton>
          </Grid>
        </ArgonBox>

        {/* <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              'selectedFlatRows[].original': selectedFlatRows.map(
                d => d.original
              ),
            },
            null,
            2
          )}
        </code>
      </pre> */}
      </div>
    </ArgonBox>
  );
}
// Setting default values for the props of Table
Table.defaultProps = {
  data: [{}],
  columns: [{}],
  row: {},
  title: "",
};

// Typechecking props for the Table
Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  row: PropTypes.object,
  onChildClick: PropTypes.func,
  title: PropTypes.string,
  getToggleAllRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func,
};

const ReactTableAddCheckBox = ({ columns, data, onChildClick, title }) => {
  const [selectedRows, setSelectedRows] = useState(null);

  const exportSelecedRows = (srows) => {
    setSelectedRows(srows);
    onChildClick(srows);
  };

  return (
    <ArgonBox m={2}>
      <Styles>
        <Table columns={columns} data={data} onChildClick={exportSelecedRows} title={title} />
      </Styles>
    </ArgonBox>
  );
};

// Setting default values for the props of ReactTableAddCheckBox
ReactTableAddCheckBox.defaultProps = {
  data: [{}],
  columns: [{}],
  title: "",
};

// Typechecking props for the ReactTableAddCheckBox
ReactTableAddCheckBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  onChildClick: PropTypes.func,
  title: PropTypes.string,
};

export default ReactTableAddCheckBox;
