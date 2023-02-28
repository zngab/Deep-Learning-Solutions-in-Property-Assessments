/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as stats from "../../utils/stats";
import ReactTableWithExport from "./ReactTableWithExport";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as Utils from "utils/dlv_utils";
import Select from "react-select";

import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import tab from "assets/theme/components/tabs/tab";
import TableWithExport from "./TableWithExport";
import DataTable from "examples/Tables/DataTable";

const PivotTable = ({ dataSet, buttonName, buttonClass }) => {
  const [rowCategory, setRowCategory] = useState("");
  const [colCategory, setColCategory] = useState("");
  const [thirdCategory, setThirdCategory] = useState("");

  const [colNames, setColNames] = useState([]);
  const [displayPivot, setDisplayPivot] = useState(false);
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableTitle, setTableTitle] = useState("");

  useEffect(() => {
    let columnNames = [{ value: "Reset", label: "Reset" }];
    if (Array.isArray(dataSet) && dataSet.length > 0 && colNames.length === 0) {
      Object.keys(dataSet[0]).forEach((key) => {
        columnNames.push({ value: key, label: key });
      });

      setColNames(columnNames);
    }

    //eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   if (colNames.length > 0) console.log(colNames);
  // }, [colNames]);

  useEffect(() => {
    let finalTitle = "Pivot Summary of ";
    if (rowCategory && colCategory) {
      finalTitle = finalTitle
        .concat(Utils.capitalizeFirstLetter(rowCategory))
        .concat(" by ")
        .concat(Utils.capitalizeFirstLetter(colCategory));
      if (thirdCategory)
        finalTitle = finalTitle.concat(" by ").concat(Utils.capitalizeFirstLetter(thirdCategory));
      setTableTitle(finalTitle);
    }
  }, [rowCategory, colCategory, thirdCategory]);

  const onChangeRow = (e) => {
    if (e.value === "Reset") {
      setRowCategory("");
    } else {
      setRowCategory(e.value);
    }
  };

  const onChangeCol = (e) => {
    if (e.value === "Reset") {
      setColCategory("");
    } else {
      setColCategory(e.value);
    }
  };
  const onChangeThird = (e) => {
    if (e.value === "Reset") {
      setThirdCategory("");
    } else {
      setThirdCategory(e.value);
    }
  };

  const createPvtTbl = () => {
    if (!rowCategory || !colCategory) {
      alert("Both Row Choice and Column Choice are required for Pivot Operation");
    } else {
      const result = stats.createPivotTable(dataSet, rowCategory, colCategory, thirdCategory);
      // const cols = [{ field: "id", headerName: "ID" }];
      const cols = [];
      if (result.tableData) {
        if (result.tableLevel > 2) {
          cols.push({
            headerName: thirdCategory,
            field: thirdCategory,
            width: 150,
          });
        }
        cols.push({
          headerName: rowCategory,
          field: rowCategory,
          width: 150,
        });

        for (let i = 0; i < result.colCtgValues.length; i++) {
          cols.push({
            headerName: colCategory.concat(" : ").concat(result.colCtgValues[i]),
            field: result.colCtgValues[i],
            width: 150,
          });
        }

        cols.push({ headerName: "RowTotal", field: "RowTotal", width: 150 });
        setColumns(cols);
        setTableData(result.tableData);
        setDisplayPivot(true);
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <Card sx={{ fontSize: "0.8em", overflowX: "hidden", overflowY: "auto" }}>
      {colNames.length > 0 && (
        <ArgonBox m={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <ArgonBox m={3}>
                <Select
                  options={colNames}
                  value={colNames.filter((col) => {
                    return rowCategory !== "Reset" ? col.value === rowCategory : null;
                  })}
                  onChange={onChangeRow}
                  label="Row Choice"
                  placeholder="Row Choice"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      minWidth: "100%",
                      width: "max-content",
                    }),
                  }}
                />
              </ArgonBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <ArgonBox m={3}>
                <Select
                  options={colNames}
                  value={colNames.filter((col) => {
                    return colCategory !== "Reset" ? col.value === colCategory : null;
                  })}
                  onChange={onChangeCol}
                  label="Column Choice"
                  placeholder="Column Choice"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      minWidth: "100%",
                      width: "max-content",
                    }),
                  }}
                />
              </ArgonBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <ArgonBox m={3}>
                <Select
                  options={colNames}
                  value={colNames.filter((col) => {
                    return thirdCategory !== "Reset" ? col.value === thirdCategory : null;
                  })}
                  onChange={onChangeThird}
                  label="Third Choice"
                  placeholder="Third Choice"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      minWidth: "100%",
                      width: "max-content",
                    }),
                  }}
                />
              </ArgonBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <ArgonBox m={3}>
                <ArgonButton variant={buttonClass} color="primary" onClick={createPvtTbl}>
                  {buttonName}
                </ArgonButton>
              </ArgonBox>
            </Grid>
          </Grid>
        </ArgonBox>
      )}

      {displayPivot ? (
        // <ReactTableWithExport
        //   columns={columns}
        //   data={tableData}
        //   filterTypeOfCols={null}
        //   title={tableTitle}
        // />
        // <TableWithExport columns={columns} rows={tableData} title={tableTitle} />
        <ArgonBox mt={0} mb={3} ml={3} mr={3}>
          <DataTable columns={columns} rows={tableData} title={tableTitle} />
        </ArgonBox>
      ) : (
        <ArgonBox minHeight="150px" pr={2} mr={3} sx={{ overflowX: "hidden", overflowY: "auto" }} />
      )}
    </Card>
  );
};

PivotTable.propTypes = {
  dataSet: PropTypes.arrayOf(PropTypes.object),
  buttonName: PropTypes.string,
  buttonClass: PropTypes.string,
};

export default PivotTable;
