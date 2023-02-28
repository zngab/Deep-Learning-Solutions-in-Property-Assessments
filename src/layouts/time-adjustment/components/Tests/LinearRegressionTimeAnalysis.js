import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ArgonInput from "components/ArgonInput";

import * as stats from "utils/stats";
import ScatterplotwithBestFitLine from "examples/Charts/ScatterplotwithBestFitLine";
import ReactTableAddCheckBox from "examples/Tables/ReactTableAddCheckBox";
import LineChartwithTwoSeries from "examples/Charts/LineChartwithTwoSeries";
// Argon Dashboard 2 MUI context
import {
  useArgonController,
  // setOpenConfigurator,
  // setDarkSidenav,
  // setMiniSidenav,
  // setFixedNavbar,
  // setSidenavColor,
  // setDarkMode,
  setData,
  setMinAdjPrice,
  setMaxAdjPrice,
} from "context";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

const LinearRegressionTimeAnalysis = ({ numberofXTicks = 36, dependant = "SAR" }) => {
  const [controller, dispatch] = useArgonController();

  const { openConfigurator, darkSidenav, miniSidenav, fixedNavbar, sidenavColor, darkMode, data } =
    controller;
  let navigate = useNavigate();
  const [taf, setTaf] = useState([]);
  const [lower, setLower] = useState(dependant === "SAR" ? 0.3 : 0);
  const [higher, setHigher] = useState(dependant === "SAR" ? 2.0 : 500);
  const [taModel, setTaModel] = useState(null);
  const [displayTAFChart, setDisplayTAFChart] = useState(false);
  const [tafData, setTafData] = useState([]);
  const [tafLabels, setTafLabels] = useState({
    xLabel: "",
    yLabel: "",
  });
  const taModelType = "Linear".concat(dependant);

  const [chartData, setChartData] = useState(null);
  const [formulaData, setFormulaData] = useState(null);
  const [formulaColumns, setFormulaColumns] = useState(null);
  const chartLabels = {
    xLabel: "Month",
    yLabel: dependant === "SAR" ? "SAR" : "Unit Sale Price",
  };

  let chartUnits = {
    unitX: "",
    unitY: "",
  };
  const [bestFitLine, setBestFitLine] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const [assrTaf, setAssrTaf] = useState([]);

  useEffect(() => {
    //Extract Assessor's Taf when data is available
    if (data.rows) {
      extractAssrTaf(data.rows);
      filterData(data.rows, dependant);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterData(data.rows, dependant);
  }, [lower, higher]);

  useEffect(() => {
    if (chartData !== null) {
      createLinearModel(chartData);
    }
  }, [chartData]);

  useEffect(() => {
    if (!displayTAFChart) setDisplayTAFChart(true);
  }, [tafData]);

  //extract assessor's time adj factors from source data and sort in ascending order of 'months'
  const extractAssrTaf = (data) => {
    const months = [...new Set(data.map((data) => data["months"]))].sort((a, b) => a - b);
    const assrTAFs = [];
    for (let i = 0; i < months.length; i++) {
      const currentArr = [];

      data.forEach((d) => {
        if (months[i] === d["months"]) currentArr.push(d["assrTaPct"]);
      });
      if (currentArr.length > 0) {
        const medTAF = stats.calcMedian(currentArr);
        assrTAFs.push({
          month: months[i].toString(),
          factor: parseFloat(medTAF.toFixed(2)),
        });
      }
    }
    if (assrTAFs.length > 0) {
      setAssrTaf(assrTAFs);
    } else {
      alert("Failed to Retrieve Assessors Time Factors!!");
    }
  };

  const onChangeLower = (e) => {
    e.preventDefault();
    setLower(parseFloat(e.target.value));
  };

  const onChangeHigher = (e) => {
    e.preventDefault();
    setHigher(parseFloat(e.target.value));
  };

  const filterData = (dt, dep) => {
    let filteredData = null;
    if (Array.isArray(dt) && dt.length > 0) {
      //Filter out the outliers
      if (dep === "SAR") {
        filteredData = dt.filter((d) => d.sar >= lower && d.sar <= higher);
      } else {
        filteredData = dt.filter((d) => d.unitSalePrice >= lower && d.unitSalePrice <= higher);
      }

      //Set the scatter chart data
      extractChartData(filteredData);

      //Display the Scatter chart and Create linear regression model
      createLinearModel(filteredData);
    } else {
      alert("No data to work with for Time Adjustment Analysis.");
    }
  };

  const createBestFitLine = (model) => {
    const fitLine = {};
    fitLine.x1 = 1;
    fitLine.y1 = model.constant + model.slope * fitLine.x1;
    fitLine.x2 = numberofXTicks;
    fitLine.y2 = model.constant + model.slope * fitLine.x2;
    setBestFitLine(fitLine);
  };

  const extractChartData = (fData) => {
    const cData = fData.map((d) => {
      return {
        x: d.months,
        y: dependant === "SAR" ? d.sar : d.unitSalePrice,
      };
    });
    setChartData(cData);
  };

  const createTaf = (selectedRows) => {
    let timeFactors = [];
    let constant = 0;
    let slope = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].original.variable === "constant") constant = taModel.constant;
      if (selectedRows[i].original.variable === "slope") slope = taModel.slope;
    }
    const endY = constant + slope * (numberofXTicks + 1);
    for (let i = 1; i <= numberofXTicks; i++) {
      const monthFactor = (endY / (constant + slope * i) - 1) * 100;
      timeFactors.push({
        month: i.toString(),
        factor: Math.abs(monthFactor) > 0 ? parseFloat(monthFactor.toFixed(2)) : 0,
      });
    }
    setTaf(timeFactors);
    const audData = calculateAudAdjPrice(data.rows, timeFactors);
    setData(dispatch, { ...data, rows: audData });

    setDisplayTAFChart(false);
    setTafData([]);
    const tData = [];

    for (let i = 0; i < timeFactors.length; i++) {
      const found = assrTaf.find((t) => t.month === timeFactors[i].month);
      if (found) {
        tData.push({
          x: parseInt(timeFactors[i].month),
          y1: found.factor,
          y2: timeFactors[i].factor,
        });
      } else {
        tData.push({
          x: parseInt(timeFactors[i].month),
          y1: null,
          y2: timeFactors[i].factor,
        });
      }
    }

    setTafData(tData);
    setTafLabels({
      xLabel: "Month",
      yLabel: "Time Adj. Factors",
    });
  };

  const calculateAudAdjPrice = (dt, tafactors) => {
    const adjPArr = [];
    const audAdjData = dt.map((d) => {
      let monthFactor = 0.0;
      const found = tafactors.find((f) => parseInt(f.month) === d.months);
      if (found) monthFactor = found.factor;
      d.audTaPct = monthFactor;
      const audAdjPrice = d.salePrice * (1 + monthFactor / 100) + d.otherAdj;
      d.audAdjPrice = audAdjPrice;
      adjPArr.push(audAdjPrice);
      return d;
    });
    const minAdjP = stats.calcMin(adjPArr);
    const maxAdjP = stats.calcMax(adjPArr);
    setMinAdjPrice(dispatch, minAdjP);
    setMaxAdjPrice(dispatch, maxAdjP);
    return audAdjData;
  };

  // const saveTAResult = (e) => {
  //   e.preventDefault();
  //   // if this is a regional TA test, save TA factors to RegTestResult Table
  //   if (regionalanalysis) {
  //     //check if regTestResults has existing result with the same munigroup, aug, assessment year, and the same TA model type
  //     const found = regTestResults.find(
  //       (result) => result.asmtyear === ayear && result.munigroup === muni && result.aug === aug
  //     );
  //     if (found) {
  //       //update the existing result
  //       const currentResult = {
  //         ...found,
  //         regtamodel: taf,
  //         rtmodeltype: taModelType,
  //         rtstatsr2: taModel.r2,
  //         rtstatsfval: taModel.F_test,
  //       };
  //       // setRTestResult(currentResult);
  //       updateRegTestResult(currentResult);
  //       alert("Successfully saved time factors in Regional TA test result table.");
  //     } else {
  //       // add a new result in the regional test result table
  //       const newRegTAResult = {
  //         ...rTestResult,
  //         munigroup: muni,
  //         aug: aug,
  //         rtmodeltype: taModelType,
  //         regtamodel: taf,
  //         rtstatsr2: taModel.r2,
  //         rtstatsfval: taModel.F_test,
  //       };
  //       addRegTestResult(newRegTAResult);
  //       // setRTestResult(newRegTAResult);
  //       alert("Successfully added time factors in Regional TA test result table.");
  //     }

  //     //Navigate back to Dashboard
  //     navigate("/dashboard");
  //   } else {
  //     //save TA factors to muni test result table
  //     const found = muniTestResults.find(
  //       (result) =>
  //         result.asmtyear === ayear &&
  //         result.municode === muni &&
  //         //result.test.replace(/\s+/g, '').split('-')[0] === testcode
  //         result.test.slice(0, 7) === testcode
  //     );

  //     if (found) {
  //       //update the existing result
  //       const currentResult = {
  //         ...found,
  //         output_taf: taf,
  //         tamodeltype: taModelType,
  //         tamodelr2: taModel.r2,
  //         tamodelfval: taModel.F_test,
  //       };

  //       setMTestResult(currentResult);
  //       updateMuniTestResult(currentResult);

  //       alert("Successfully saved time factors in Municipal test result table.");
  //     } else {
  //       // add a new result in the muni test result table
  //       const curTest = qualityTests.find((t) => t.code === testcode && t.isactive);
  //       if (curTest) {
  //         const newMuniTAResult = {
  //           ...mTestResult,
  //           municode: muni,
  //           test: curTest.code.concat(" - ").concat(curTest.name),
  //           output_variable: curTest.output,
  //           tamodeltype: taModelType,
  //           output_taf: taf,
  //           tamodelr2: taModel.r2,
  //           tamodelfval: taModel.F_test,
  //         };
  //         setMTestResult(newMuniTAResult);
  //         addMuniTestResult(newMuniTAResult);
  //         alert("Successfully added time factors in Municipal TA test result table.");
  //       } else {
  //         alert(
  //           "Failed to add time factors in Municipal test result table, test maybe deactivated."
  //         );
  //       }
  //     }

  //     setDisplaySaveScore("");
  //   }
  // };

  const createLinearModel = (fData) => {
    let depValues = [];
    let indepValues = [];
    for (let i = 0; i < fData.length; i++) {
      depValues.push(fData[i].y);
      indepValues.push(fData[i].x);
    }

    const model = stats.simpleLinearRegression(depValues, indepValues);
    setTaModel(model);
    createBestFitLine(model);
    generateFormulaTableContent(model);
  };

  const generateFormulaTableContent = (md) => {
    const columns = [
      {
        Header: "Variable",
        accessor: "variable",
      },
      {
        Header: "Coefficient",
        accessor: "coefficient",
      },
      {
        Header: "T-Test",
        accessor: "t_test",
      },
    ];
    const fmlData = [
      {
        variable: "constant",
        coefficient: md.constant.toFixed(5),
        t_test: md.t_test_constant.toFixed(5),
      },
      {
        variable: "slope",
        coefficient: md.slope.toFixed(5),
        t_test: md.t_test_slope.toFixed(5),
      },
    ];

    setFormulaColumns(columns);
    setFormulaData(fmlData);
  };

  return (
    <Card>
      <ArgonBox p={2}>
        {/* <ArgonTypography
          variant="h5"
          color="black"
          fontWeight="medium"
          sx={{ mt: 3, mb: 5, pb: 1 }}
        >
          {dependant}&nbsp;&nbsp;Linear&nbsp;&nbsp;Regression&nbsp;&nbsp;Trend&nbsp;&nbsp;Analysis
        </ArgonTypography> */}
        {/*Set outliers range */}
        <ArgonBox mt={5} mb={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <ArgonBox pl={6} pr={6}>
                <ArgonTypography
                  display="flex"
                  alignItems="center"
                  variant="button"
                  fontWeight="bold"
                >
                  Min&nbsp;&nbsp;{dependant}&nbsp;&nbsp;
                  <ArgonInput
                    type="number"
                    name="lower"
                    // placeholder="Minimum SAR"
                    size="medium"
                    value={lower}
                    onChange={onChangeLower}
                  />
                </ArgonTypography>
              </ArgonBox>
            </Grid>
            <Grid item xs={12} md={3}>
              <ArgonBox pl={6} pr={6}>
                <ArgonTypography
                  display="flex"
                  alignItems="center"
                  variant="button"
                  fontWeight="bold"
                >
                  Max&nbsp;&nbsp;{dependant}&nbsp;&nbsp;
                  <ArgonInput
                    type="number"
                    name="higher"
                    // placeholder="Maximum SAR"
                    size="medium"
                    value={higher}
                    onChange={onChangeHigher}
                  />
                </ArgonTypography>
              </ArgonBox>
            </Grid>
          </Grid>
        </ArgonBox>
        {/*Scatter chart loaded here */}
        <ArgonBox m={2}>
          <Grid container spacing={3}>
            <Grid item xl={12}>
              {chartData && (
                <ScatterplotwithBestFitLine
                  data={chartData}
                  labels={chartLabels}
                  fitline={bestFitLine}
                  units={chartUnits}
                  title={dependant.concat(" Linear Regression Time Adjustment Analysis")}
                  numOfXTicks={numberofXTicks < 36 ? numberofXTicks : 36}
                />
              )}
            </Grid>
          </Grid>
        </ArgonBox>
        {/*Display formula table here */}
        <ArgonBox m={2}>
          <Grid container spacing={3}>
            <Grid item xl={12}>
              {formulaColumns && (
                <ReactTableAddCheckBox
                  columns={formulaColumns}
                  data={formulaData}
                  onChildClick={createTaf}
                  title="Linear Regression Model Details"
                />
              )}
            </Grid>
          </Grid>
        </ArgonBox>
        {/*Display Time Factors Line Chart here */}
        <ArgonBox m={2}>
          <Grid container spacing={3}>
            <Grid item xl={12}>
              {tafData.length > 0 && displayTAFChart && (
                <LineChartwithTwoSeries
                  data={tafData}
                  labels={tafLabels}
                  title="Assessor Time Factors vs Auditor Time Factors"
                  seriesNames={["Assessor TAFs", "Auditor TAFs"]}
                  numOfXTicks={numberofXTicks < 36 ? numberofXTicks : 36}
                />
              )}
            </Grid>
          </Grid>
        </ArgonBox>
      </ArgonBox>
    </Card>
  );
};

// Setting default values for the props of LinearRegressionTimeAnalysis
LinearRegressionTimeAnalysis.defaultProps = {
  numberofXTicks: 36,
  dependant: "sar",
};

// Typechecking props for the LinearRegressionTimeAnalysis
LinearRegressionTimeAnalysis.propTypes = {
  numberofXTicks: PropTypes.number.isRequired,
  dependant: PropTypes.string.isRequired,
};

export default LinearRegressionTimeAnalysis;
