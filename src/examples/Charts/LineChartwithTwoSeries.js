import React, { useState, useEffect, useCallback } from "react";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";
import PropTypes from "prop-types";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
//import MUI components
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
//import Argon Components
import ArgonBox from "components/ArgonBox/index";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton/";

const LineChartwithTwoSeries = (props) => {
  const {
    data, // An array of objects following the structure like [{y1: y2: x: },{}]
    labels: { xLabel, yLabel },
    title,
    seriesNames, //An array of series names
    numOfXTicks,
  } = props;
  const [getLinePng, { ref: lineRef }] = useCurrentPng();
  const handleLineDownload = useCallback(async () => {
    const png = await getLinePng();
    if (png) {
      FileSaver.saveAs(png, "taf-line-chart.png");
    }
  }, [getLinePng]);

  const wrapperStyle = {
    display: "block",
    marginTop: "20px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    height: "100%",
    fontFamily: "Sans-serif",
    fontSize: "0.7em",
    backgroundColor: "#F7F6F5",
  };

  const chartMargins = {
    top: 10,
    right: 20,
    left: 20,
    bottom: 20,
  };

  let points = [...data];

  const [chartTicks, setChartTicks] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([]);

  useEffect(() => {
    const cTicks = [];
    if (data) {
      const y1Values = data.map((d) => d.y1);
      const y2Values = data.map((d) => d.y2);
      const minY1 = Math.min(...y1Values.filter((v) => v !== null));
      const minY2 = Math.min(...y2Values.filter((v) => v !== null));
      const maxY1 = Math.max(...y1Values.filter((v) => v !== null));
      const maxY2 = Math.max(...y2Values.filter((v) => v !== null));
      const min =
        Math.round(minY1 * 1000) / 1000 <= Math.round(minY2 * 1000) / 1000
          ? Math.round(minY1 * 1000) / 1000
          : Math.round(minY2 * 1000) / 1000;
      const max =
        Math.round(maxY1 * 1000) / 1000 >= Math.round(maxY2 * 1000) / 1000
          ? Math.round(maxY1 * 1000) / 1000
          : Math.round(maxY2 * 1000) / 1000;
      const interval = Math.abs(Math.round(((max - min) / 9) * 1000) / 1000); //to split the full range into 10 equal intervals
      const start = Math.round((min - interval) * 1000) / 1000;
      const end = Math.round((max + interval) * 1000) / 1000;
      cTicks.push(start);
      for (let i = 1; i <= 10; i++) {
        cTicks.push(Math.round((start + i * interval) * 1000) / 1000);
      }
      cTicks.push(end);
    }
    setChartTicks(cTicks);
    setYAxisDomain([cTicks[0], cTicks[11]]);
    // eslint-disable-next-line
  }, []);

  return (
    <ArgonBox sx={wrapperStyle}>
      <ArgonBox p={2}>
        <ArgonTypography
          variant="h5"
          color="text"
          fontWeight="medium"
          sx={{ mt: 2, mb: 2 }}
          align="center"
        >
          {title}
        </ArgonTypography>
      </ArgonBox>
      <ResponsiveContainer width={"100%"} height={500}>
        <LineChart data={points} margin={chartMargins} ref={lineRef}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="top" align="right" />

          <XAxis
            dataKey="x"
            padding={{ bottom: 30 }}
            domain={["dataMin", "dataMax"]}
            tickCount={numOfXTicks}
            type="number"
            label={{
              value: xLabel,
              position: "bottom",
              offset: 0,
            }}
          />
          <YAxis
            type="number"
            domain={yAxisDomain}
            ticks={chartTicks}
            label={{ value: yLabel, angle: -90, position: "left" }}
          />
          <Line
            name={seriesNames[0]}
            dataKey="y1"
            stroke="blue"
            type="monotone"
            dot={true}
            activeDot={true}
          />
          <Line
            name={seriesNames[1]}
            dataKey="y2"
            stroke="orange"
            type="monotone"
            dot={true}
            activeDot={true}
          />
        </LineChart>
      </ResponsiveContainer>
      <ArgonBox m={3}>
        <Grid container justifyContent="center">
          <ArgonButton variant="gradient" color="primary" onClick={handleLineDownload}>
            Download Line Chart
          </ArgonButton>
        </Grid>
      </ArgonBox>
    </ArgonBox>
  );
};

LineChartwithTwoSeries.defaultProps = {
  data: [{}],
  labels: {},
  title: "",
  seriesNames: [],
  numOfXTicks: 36,
};

LineChartwithTwoSeries.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  labels: PropTypes.object,
  title: PropTypes.string,
  seriesNames: PropTypes.array,
  numOfXTicks: PropTypes.number,
};

export default LineChartwithTwoSeries;
