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

const CompareMeans = ({ dataSet, buttonName, buttonClass }) => {
  const [valueColumn, setValueColumn] = useState("");
  const [stratumColumn, setStratumColumn] = useState("");
  const [StratumColumn, setThirdCategory] = useState("");

  const [colNames, setColNames] = useState([]);
  const [displayCompMeans, setDisplayCompMeans] = useState(false);
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

  useEffect(() => {
    let finalTitle = "Descirptive Summary of ";
    if (valueColumn) {
      finalTitle = finalTitle.concat(Utils.capitalizeFirstLetter(valueColumn));
      if (stratumColumn)
        finalTitle = finalTitle.concat(" by ").concat(Utils.capitalizeFirstLetter(stratumColumn));
      setTableTitle(finalTitle);
    }
  }, [valueColumn, stratumColumn]);

  const onChangeValueColumn = (e) => {
    if (e.value === "Reset") {
      setValueColumn("");
    } else {
      setValueColumn(e.value);
    }
  };

  const onChangeStratumColumn = (e) => {
    if (e.value === "Reset") {
      setStratumColumn("");
    } else {
      setStratumColumn(e.value);
    }
  };

  const createCompMeans = () => {
    if (!valueColumn) {
      alert("Value Column is required for Compare Means Operation");
    } else {
      const result = stats.compareMeans(dataSet, valueColumn, stratumColumn);
      // const cols = [{ field: "id", headerName: "ID" }];
      const cols = [];
      if (result.tableData) {
        if (result.tableLevel > 1) {
          cols.push({
            headerName: stratumColumn,
            field: stratumColumn,
            width: 150,
          });
        } else {
          cols.push({
            headerName: valueColumn,
            field: valueColumn,
            width: 150,
          });
        }

        const meanStats = [
          {
            headerName: "Mean",
            field: "MEAN",
            width: 150,
          },
          {
            headerName: "Median",
            field: "MEDIAN",
            width: 150,
          },
          {
            headerName: "Min",
            field: "MIN",
            width: 150,
          },
          {
            headerName: "Max",
            field: "MAX",
            width: 150,
          },
          {
            headerName: "Count",
            field: "COUNT",
            width: 150,
          },
        ];

        cols.push(...meanStats);
        setColumns(cols);
        setTableData(result.tableData);
        setDisplayCompMeans(true);
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
                    return valueColumn !== "Reset" ? col.value === valueColumn : null;
                  })}
                  onChange={onChangeValueColumn}
                  label="Value Column"
                  placeholder="Value Column"
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
                    return stratumColumn !== "Reset" ? col.value === stratumColumn : null;
                  })}
                  onChange={onChangeStratumColumn}
                  label="Stratum Column"
                  placeholder="Stratum Column"
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
              <ArgonBox mt={3} mb={3}>
                <ArgonButton variant={buttonClass} color="primary" onClick={createCompMeans}>
                  {buttonName}
                </ArgonButton>
              </ArgonBox>
            </Grid>
          </Grid>
        </ArgonBox>
      )}

      {displayCompMeans ? (
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

CompareMeans.propTypes = {
  dataSet: PropTypes.arrayOf(PropTypes.object),
  buttonName: PropTypes.string,
  buttonClass: PropTypes.string,
};

export default CompareMeans;
