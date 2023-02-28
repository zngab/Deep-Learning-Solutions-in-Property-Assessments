/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useRef } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// Argon Dashboard 2 MUI base styles
import breakpoints from "assets/theme/base/breakpoints";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton/index";
import ArgonInput from "components/ArgonInput";
import Header from "examples/Header";
// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Argon Dashboard 2 MUI components
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Argon Dashboard 2 MUI context
import {
  useArgonController,
  // setOpenConfigurator,
  // setDarkSidenav,
  // setMiniSidenav,
  // setFixedNavbar,
  // setSidenavColor,
  // setDarkMode,
  setTrainData,
  setTestData,
  setData,
  setMinAdjPrice,
  setMaxAdjPrice,
  setFeatureColumns,
  setLabelColumns,
} from "context";
import DataTable from "examples/Tables/DataTable";
import PivotTable from "examples/Tables/PivotTable";
import CompareMeans from "examples/Tables/CompareMeans";
import DragList from "components/draganddrop/DragList";
import * as Stats from "utils/stats";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import FileOpenIcon from "@mui/icons-material/FileOpen";
//import dlv_utils
import * as Utils from "utils/dlv_utils";
const bgImage = process.env.PUBLIC_URL + "/images/data-preparation.jpg";

// DataPreparation page components
// import BaseLayout from "layouts/time-adjustment/components/BaseLayout";
// import PaymentMethod from "layouts/time-adjustment/components/PaymentMethod";
// import Invoices from "layouts/time-adjustment/components/Invoices";
// import DataPreparationInformation from "layouts/time-adjustment/components/DataPreparationInformation";
// import Transactions from "layouts/time-adjustment/components/Transactions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <ArgonBox sx={{ pt: 3 }}>{children}</ArgonBox>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DataPreparation() {
  const [controller, dispatch] = useArgonController();
  const hiddenFileInput = useRef(null);
  const {
    openConfigurator,
    darkSidenav,
    miniSidenav,
    fixedNavbar,
    sidenavColor,
    darkMode,
    data,
    trainData,
    testData,
  } = controller;
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [dndColumns, setDndColumns] = useState({});
  const [displayTransformation, setDisplayTransformation] = useState(false);
  const [displayRecoding, setDisplayRecoding] = useState(false);
  const [displayNormalisation, setDisplayNormalisation] = useState(false);
  const [displaySplitting, setDisplaySplitting] = useState(false);
  const [pctSplit, setPctSplit] = useState(0.3);

  useEffect(() => {
    if (data) createDndColumns(data.columns);
  }, [data]);
  useEffect(() => {
    if (Object.keys(dndColumns).length > 0) {
      if (tabValue === 1) {
        clearDisplays();
        setDisplayRecoding(true);
      }
      if (tabValue === 2) {
        clearDisplays();
        setDisplayTransformation(true);
      }
      if (tabValue === 3) {
        clearDisplays();
        setDisplayNormalisation(true);
      }
      if (tabValue === 4) {
        clearDisplays();
        setDisplaySplitting(true);
      }
      if (tabValue !== 0) createDndColumns(data.columns, tabValue);
    }
  }, [tabValue]);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    if (Object.keys(dndColumns).length > 1) {
      console.log(dndColumns);
    }
  }, [dndColumns]);

  const clearDisplays = () => {
    setDisplayRecoding(false);
    setDisplayTransformation(false);
    setDisplayNormalisation(false);
    setDisplaySplitting(false);
  };
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const createDndColumns = (cols, tab = 0) => {
    let newColumns = {};
    // setDisplayRecoding(!displayRecoding);
    // setDisplayTransformation(!displayTransformation);
    if (Array.isArray(cols)) {
      if (cols.length > 0) {
        newColumns = {
          ...newColumns,
          source: createSourceItems(cols),
        };

        if (tab === 1) newColumns = { ...newColumns, labelEncoder: [] };
        if (tab === 2) newColumns = { ...newColumns, oneHotEncoder: [], binaryEncoder: [] };
        if (tab === 3) newColumns = { ...newColumns, minMaxNormalizer: [] };
        if (tab === 4) newColumns = { ...newColumns, featureCols: [], labelCols: [] };
      }
    } else {
      alert("Failed to load Sales Data.", "danger");
    }

    setDndColumns(newColumns);
  };

  const createSourceItems = (cols) => {
    let sourceItems = [];

    for (const col of cols) {
      sourceItems.push({
        id: col.field,
        prefix: "source",
        content: col.field,
      });
    }

    return sourceItems;
  };

  const handleHiddenClick = (e) => {
    hiddenFileInput.current.click();
  };

  const onChangePctSplit = (e) => {
    if (statsUtils.isNumber(e.target.value)) {
      setPctSplit(typeof e.target.value === "string" ? parseFloat(e.target.value) : e.target.value);
    } else {
      alert("Percentage Split must be number value.");
    }
  };

  const handleLoadAdjSalesData = (e) => {
    let file = e.target.files[0];

    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        /* Sale data columns: 
		id,assessment,saleDate,months,assrTaPct,salePrice,assrAdjPrice,
		totalImps,modelCode,quality,condition,age,bsmtAreaSF,lotSizeSF,
		nbhd,marketArea,prevAsmt,sar,floorAreaSF,audTaPct,audAdjPrice.
		****
		Output columns is an array of objects with below structure: (example)
		****
		 [
			{
				field: "id",
				headerName: "Id", could be pure string or unicode like "***\u00a0***"
				width: 120,
				align: "center",
				valueGetter: (params)=>params.row.id.toLocaleString("en-US"),
			},
			{
				field: "age",
				headerName: "Age", could be pure string or unicode like "***\u00a0***"
				width: 50,
				align: "center",
				valueGetter: (params)=>params.row.age.toFixed(0),
			},
			...
		 ]
	*/
        let cols = Utils.defineSalesTableColumns(resp.rows[0]);
        let rows = [];
        let adjPArray = [];
        for (let i = 1; i < resp.rows.length; i++) {
          let row = {};
          for (let j = 0; j < resp.rows[0].length; j++) {
            Object.assign(row, { [resp.rows[0][j]]: resp.rows[i][j] });
            // row[cols[j].id] = resp.rows[i][j];
          }
          adjPArray.push(row["audAdjPrice"]);
          rows.push(row);
        }
        const minAdjP = Stats.calcMin(adjPArray);
        const maxAdjP = Stats.calcMax(adjPArray);
        setData(dispatch, { columns: cols, rows: rows });
        setMinAdjPrice(dispatch, minAdjP);
        setMaxAdjPrice(dispatch, maxAdjP);
      }
    });
  };

  const saveTransformations = (cols) => {
    let newData = {};
    const sourceData = { ...data };
    //Conduct binary encoding
    if (cols.binaryEncoder.length > 0) {
      newData = Stats.binaryEncoder(sourceData, cols);
    }
    //Conduct oneHot encoding
    if (cols.oneHotEncoder.length > 0) {
      newData = Stats.oneHotEncoder(newData, cols);
    }
    // Set data in context
    setData(dispatch, newData);
    setDisplayTransformation(false);
  };

  // const splitDatasets = (cols) => {
  //   if (cols.labelCols.length < 1 || cols.featureCols.length < 1) {
  //     alert("Label Columns and Feature Columns are REQUIRED for this operation.");
  //   } else {
  //     const sourceData = { ...data };
  //     //Use Selectd features as independant variables and label as dependant variable
  //     //to create tensors
  //     const [trainingData, testingData] = Stats.splitData(sourceData, cols);

  //     // Set data in context
  //     setTrainData(dispatch, trainingData);
  //     setTestData(dispatch, testingData);
  //     //set feature columns and label columns in context
  //     setFeatureColumns(dispatch, cols.featureCols);
  //     setLabelColumns(dispatch, cols.labelCols);
  //     setDisplaySplitting(false);
  //   }
  // };

  const splitDatasets = () => {
    if (data.rows.length <= 0) {
      alert("No Data is Available for Splitting.");
    } else {
      const sourceData = [...data.rows];
      //Use Selectd features as independant variables and label as dependant variable
      //to create tensors
      const [trainingDataRows, testingDataRows] = Stats.splitByPct(sourceData, pctSplit);

      // Set data in context
      setTrainData(dispatch, { columns: data.columns, rows: trainingDataRows });
      setTestData(dispatch, { columns: data.columns, rows: testingDataRows });
      // //set feature columns and label columns in context
      // setFeatureColumns(dispatch, cols.featureCols);
      // setLabelColumns(dispatch, cols.labelCols);
      setDisplaySplitting(false);
    }
  };

  const saveNormalisations = (cols) => {
    let newData = {};
    const sourceData = { ...data };
    //Conduct binary encoding
    if (cols.minMaxNormalizer.length > 0) {
      newData = Stats.minMaxNormalizer(sourceData, cols);
    }

    // Set data and min and max values for the normalized columns in context
    setData(dispatch, newData);
    setDisplayNormalisation(false);
  };

  const labelEncoding = (cols) => {
    let newData = {};
    const sourceData = { ...data };
    if (cols.labelEncoder.length > 0) {
      newData = Stats.labelEncoder(sourceData, cols);
    }
    setData(dispatch, newData);
    setDisplayRecoding(false);
  };

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.5),
            rgba(gradients.info.state, 0.5)
          )}, url(${bgImage})`,
        backgroundPositionY: "65%",
      }}
    >
      <Header />
      <ArgonBox mt={3} lineHeight={1}>
        <ArgonBox sx={{ mb: 2 }}>
          <ArgonButton
            color={darkMode ? "dark" : "white"}
            component="label"
            // variant={darkSidenav ? "outlined" : "gradient"}
            variant="gradient"
            onClick={handleHiddenClick}
            fullWidth
          >
            Load Adjusted Sales Data{"   "}
            {data && (
              <span>
                <FileOpenIcon sx={{ color: darkMode ? "white" : "black", mt: 0.5, ml: 1 }} />
              </span>
            )}
          </ArgonButton>
          <input
            ref={hiddenFileInput}
            onChange={handleLoadAdjSalesData}
            accept=".xlsx"
            type="file"
            style={{ display: "none" }}
          />
        </ArgonBox>
      </ArgonBox>
      {!data ? (
        <ArgonBox height="60px" />
      ) : (
        <ArgonBox mt={5} mb={3}>
          <Grid container mb={3}>
            <Grid item xl={12}>
              <Card>
                <ArgonBox m={3}>
                  <DataTable columns={data.columns} rows={data.rows} title="Sales Table" />
                </ArgonBox>
              </Card>
            </Grid>
          </Grid>
          {trainData && (
            <Grid container mb={3}>
              <Grid item xl={12}>
                <Card>
                  <ArgonBox m={3}>
                    <DataTable
                      columns={trainData.columns}
                      rows={trainData.rows}
                      title="Training Data Set"
                    />
                  </ArgonBox>
                </Card>
              </Grid>
            </Grid>
          )}
          {testData && (
            <Grid container mb={3}>
              <Grid item xl={12}>
                <Card>
                  <ArgonBox m={3}>
                    <DataTable
                      columns={testData.columns}
                      rows={testData.rows}
                      title="Testing Data Set"
                    />
                  </ArgonBox>
                </Card>
              </Grid>
            </Grid>
          )}
          <Grid container>
            <Grid item xs={12} lg={10}>
              <AppBar position="static">
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{ bgcolor: "#C1D2DA" }}
                >
                  <Tab label="Column-Details" {...a11yProps(0)} />
                  <Tab label="Label-Encoding" {...a11yProps(1)} />
                  <Tab label="Categorical-Transformations" {...a11yProps(2)} />
                  <Tab label="Normalisation" {...a11yProps(3)} />
                  <Tab label="Datasets-Splitting" {...a11yProps(4)} />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <TabPanel value={tabValue} index={0}>
            <Grid container>
              <Grid item xl={12}>
                <PivotTable
                  dataSet={data.rows}
                  buttonName="Pivot Data Columns"
                  buttonClass="gradient"
                />
              </Grid>
              <Grid item xl={12}>
                <CompareMeans
                  dataSet={data.rows}
                  buttonName="Descriptive/CompareMeans Summary"
                  buttonClass="gradient"
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {displayRecoding && (
              <Grid container>
                <Grid item xl={12}>
                  <DragList
                    onChildClick={labelEncoding}
                    initColumns={dndColumns}
                    buttonName="Recode Selected Columns"
                  ></DragList>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {displayTransformation && (
              <Grid container>
                <Grid item xl={12}>
                  <DragList
                    onChildClick={saveTransformations}
                    initColumns={dndColumns}
                    buttonName="Transform Selected Columns"
                  ></DragList>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {displayNormalisation && (
              <Grid container>
                <Grid item xl={12}>
                  <DragList
                    onChildClick={saveNormalisations}
                    initColumns={dndColumns}
                    buttonName="Normalise Columns"
                  ></DragList>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            {displaySplitting && (
              <Grid container>
                {/* <Grid item xl={12}>
                  <DragList
                    onChildClick={splitDatasets}
                    initColumns={dndColumns}
                    buttonName="Split Datasets"
                  ></DragList>
                </Grid> */}
                <Grid item xs={12} md={3}></Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{ justifyContent: "center", p: 2, pl: 5, pr: 5, m: 2 }}
                >
                  <ArgonTypography display="flex" alignItems="center" variant="button">
                    Test&nbsp;Data&nbsp;Portion&nbsp;
                    <ArgonInput
                      type="number"
                      name="pctSplit"
                      size="medium"
                      value={pctSplit}
                      onChange={onChangePctSplit}
                    />
                  </ArgonTypography>
                </Grid>
                <Grid item xs={12} md={3} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                  <ArgonButton variant="gradient" color="primary" onClick={splitDatasets}>
                    Split Datasets
                  </ArgonButton>
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </ArgonBox>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default DataPreparation;
