import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import * as stats from "utils/stats";
import PropTypes from "prop-types";

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
import Button from "@mui/material/Button";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
//Special dependencies for multi-trend analysis
import ScatterplotWithLoessCurve from "examples/Charts/ScatterplotWithLoessCurve";
import RangeSlider from "react-bootstrap-range-slider";
import * as statsUtils from "utils/statsUtils";

const MultiTrendRegressionTimeAnalysis = ({ numberofXTicks = 36, dependant = "SAR" }) => {
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
  let filteredData = null;
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
  const taModelType = "Multi".concat(dependant);
  const [spanvalue, setSpanvalue] = useState(30);
  const [breakpoints, setBreakpoints] = useState([]);
  const [bpoints, setBpoints] = useState({
    bp1: 0,
    bp2: 0,
    bp3: 0,
    bp4: 0,
    bp5: 0,
    bp6: 0,
  });

  const [loessLine, setLoessLine] = useState([]);

  const [assrTaf, setAssrTaf] = useState([]);

  const { bp1, bp2, bp3, bp4, bp5, bp6 } = bpoints;

  useEffect(() => {
    //Extract Assessor's Taf when data is available
    if (data.rows) {
      extractAssrTaf(data.rows);
      filterData(data.rows, dependant);
    }
    //eslint-disable-next-line
  }, []);

  //For spanvalue state change
  useEffect(() => {
    if (chartData !== null) {
      createLoessLine(chartData, spanvalue);
    }
  }, [chartData, spanvalue]);

  useEffect(() => {
    filterData(data.rows, dependant);
  }, [lower, higher]);

  useEffect(() => {
    if (!displayTAFChart) setDisplayTAFChart(true);
  }, [tafData]);

  useEffect(() => {
    if (chartData !== null && breakpoints.length > 0) {
      createMultiModel(chartData, breakpoints);
    }
  }, [breakpoints]);

  useEffect(() => {
    if (taModel !== null) generateFormulaTableContent(taModel);
  }, [taModel]);

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

  const onChangeSpanvalue = (e) => {
    e.preventDefault();
    setSpanvalue(e.target.value);
  };

  const onBPointsChanged = (e) => {
    setBpoints({
      ...bpoints,
      [e.target.name]: statsUtils.isNumber(e.target.value) ? parseInt(e.target.value) : 0,
    });
  };
  const onBreakPointsConfirmed = () => {
    let bps = [];
    for (const bp in bpoints) {
      if (bpoints[bp] > 0) bps.push(bpoints[bp]);
    }
    if (bps.length > 0) {
      bps.sort((a, b) => {
        return a - b;
      });
      setBreakpoints(bps);
    } else setBreakpoints([]);
  };

  const filterData = (dt, dep) => {
    if (Array.isArray(dt) && dt.length > 0) {
      //Filter out the outliers
      if (dep === "SAR") {
        filteredData = dt.filter((d) => d.sar >= lower && d.sar <= higher);
      } else {
        filteredData = dt.filter((d) => d.unitSalePrice >= lower && d.unitSalePrice <= higher);
      }
      //set the scatter chart data
      extractChartData(filteredData);
    } else {
      alert("No data to work with for Time Adjustment Analysis.");
    }
  };

  const createLoessLine = (cData, spanValue) => {
    //Sort data by x values before apply loess smoothing function
    cData.sort((a, b) => {
      return a.x - b.x;
    });
    let depValues = [];
    let indepValues = [];
    const span = spanValue / 100;
    for (let i = 0; i < cData.length; i++) {
      depValues.push(cData[i].y);
      indepValues.push(cData[i].x);
    }
    const loessline = stats.loessSmoothing(indepValues, depValues, span);
    if (loessline.length > 0) {
      setLoessLine(loessline);
    } else {
      setLoessLine([]);
    }
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

  const calculateMultiPred = (num, cnst, slps, totallength) => {
    let predValue = cnst;
    const splittedPrds = statsUtils.splitNumbersByBreakpoints(num, breakpoints, totallength);
    for (let i = 0; i < slps.length; i++) {
      const pred = slps[i] * splittedPrds[i];
      predValue += pred;
    }

    return predValue;
  };

  const createTaf = (selectedRows) => {
    let timeFactors = [];
    let slopes = [];

    for (let i = 0; i < taModel.coef.length; i++) {
      slopes.push(0);
    }
    const totalTAMonths = numberofXTicks < 36 ? 13 : 37;
    for (const row of selectedRows) {
      if (row.original.variable === "constant") {
        slopes[0] = taModel.coef[0];
      } else {
        const index = parseInt(row.original.variable.slice(7));
        slopes[index] = taModel.coef[index];
      }
    }

    const constant = slopes[0];
    slopes.shift(); //get rid of the constant value in the slopes array to match the splitted periods array.
    const endY = calculateMultiPred(totalTAMonths, constant, slopes, totalTAMonths);

    for (let i = 1; i < totalTAMonths; i++) {
      const pred = calculateMultiPred(i, constant, slopes, totalTAMonths);
      const monthFactor = (endY / pred - 1) * 100;
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
  //         alert("Successfully added time factors in Municipal test result table.");
  //       } else {
  //         alert(
  //           "Failed to add time factors in Municipal test result table, test maybe deactivated."
  //         );
  //       }
  //     }

  //     setDisplaySaveScore("");
  //   }
  // };

  const createMultiModel = (fData, bps) => {
    if (bps.length <= 0) {
      alert("At least ONE Break Point is needed for this operation.");
    } else {
      //Need to add '1' in the first column of indep values (only)
      //for constant oefficient to be calculated through jStat.models.ols function.
      //The first element of the output coefficient array would be the
      //constant of the multiple linear regression model.
      let depValues = [];
      let indepValues = [];
      for (let i = 0; i < fData.length; i++) {
        let constant = [1];
        depValues.push(fData[i].y);
        const splittedRowValues = statsUtils.splitNumbersByBreakpoints(
          fData[i].x,
          bps,
          numberofXTicks + 1
        );
        constant = constant.concat(splittedRowValues);
        indepValues.push(constant);
      }

      const model = stats.multipleLinearRegression(depValues, indepValues);

      setTaModel(model);
      // generateFormulaTableContent(model);
    }
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

    let fmlData = [
      {
        variable: "constant",
        coefficient: md.coef[0].toFixed(5),
        t_test: md.t.t[0].toFixed(5),
      },
    ];
    for (let i = 1; i < md.coef.length; i++) {
      const item = {
        variable: "period_".concat(i.toString()),
        coefficient: md.coef[i].toFixed(5),
        t_test: md.t.t[i].toFixed(5),
      };
      fmlData.push(item);
    }

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
                    // placeholder="Minimum UnitValue"
                    size="medium"
                    value={lower}
                    onChange={onChangeLower}
                  />
                </ArgonTypography>
              </ArgonBox>
            </Grid>
            <Grid item xs={12} md={3} sx={{ justifyContent: "right" }}>
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
                    // placeholder="Maximum UnitValue"
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
                <ScatterplotWithLoessCurve
                  data={chartData}
                  labels={chartLabels}
                  loessline={loessLine}
                  units={chartUnits}
                  title={dependant.concat(" Multi-Trend Regression Time Adjustment Analysis")}
                  numOfXTicks={numberofXTicks < 36 ? numberofXTicks : 36}
                />
              )}
            </Grid>
          </Grid>
        </ArgonBox>
        {/*Slider and break points choice grid*/}
        <ArgonBox m={5}>
          <Grid container spacing={1}>
            <Grid container item xs={12} md={4} sx={{ justifyContent: "right" }}>
              {/* <ArgonBox> */}
              <RangeSlider
                value={spanvalue}
                onChange={onChangeSpanvalue}
                tooltipLabel={(currentValue) => `Span ${currentValue}%`}
                tooltip="on"
                tooltipPlacement="top"
                min={0}
                max={100}
                variant="danger"
              />
              {/* </ArgonBox> */}
            </Grid>
            <Grid container item xs={12} md={8} spacing={1}>
              <Grid item md={1}>
                <ArgonInput
                  type="number"
                  name="bp1"
                  size="small"
                  value={bp1}
                  onChange={onBPointsChanged}
                />
              </Grid>
              <Grid item md={1}>
                <ArgonInput
                  type="number"
                  name="bp2"
                  size="small"
                  value={bp2}
                  onChange={onBPointsChanged}
                />
              </Grid>
              <Grid item md={1}>
                <ArgonInput
                  type="number"
                  name="bp3"
                  size="small"
                  value={bp3}
                  onChange={onBPointsChanged}
                />
              </Grid>
              <Grid item md={1}>
                <ArgonInput
                  type="number"
                  name="bp4"
                  size="small"
                  value={bp4}
                  onChange={onBPointsChanged}
                />
              </Grid>
              <Grid item md={1}>
                <ArgonInput
                  type="number"
                  name="bp5"
                  size="small"
                  value={bp5}
                  onChange={onBPointsChanged}
                />
              </Grid>
              <Grid item md={1}>
                <ArgonInput
                  type="number"
                  name="bp6"
                  size="small"
                  value={bp6}
                  onChange={onBPointsChanged}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ArgonButton variant="gradient" color="primary" onClick={onBreakPointsConfirmed}>
                  Set Break Points
                </ArgonButton>
              </Grid>
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
MultiTrendRegressionTimeAnalysis.defaultProps = {
  numberofXTicks: 36,
  dependant: "sar",
};

// Typechecking props for the LinearRegressionTimeAnalysis
MultiTrendRegressionTimeAnalysis.propTypes = {
  numberofXTicks: PropTypes.number.isRequired,
  dependant: PropTypes.string.isRequired,
};

export default MultiTrendRegressionTimeAnalysis;
