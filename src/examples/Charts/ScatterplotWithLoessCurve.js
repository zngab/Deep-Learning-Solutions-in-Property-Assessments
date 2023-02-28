import React, { useState, useEffect, useCallback } from "react";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import { PropTypes } from "prop-types";
//import MUI components
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
//import Argon Components
import ArgonBox from "components/ArgonBox/index";
import ArgonTypography from "components/ArgonTypography/index";
import ArgonButton from "components/ArgonButton/";

const ScatterplotWithLoessCurve = (props) => {
  const {
    data,
    labels: { xLabel, yLabel },
    units: { unitX, unitY },
    loessline, //loess data example [{ x: 1, loess: 0.678}, {},...]
    title,
    numOfXTicks,
  } = props;
  const [getComposedPng, { ref: composedRef }] = useCurrentPng();
  const handleComposedDownload = useCallback(async () => {
    const png = await getComposedPng();
    if (png) {
      FileSaver.saveAs(png, "mr-time-chart.png");
    }
  }, [getComposedPng]);

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

  let points = null;
  if (data && loessline) {
    points = [...data];
    for (let i = 0; i < loessline.length; i++) {
      points.push({
        x: loessline[i].x,
        loess: loessline[i].loess,
      });
    }
  }

  const [chartTicks, setChartTicks] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([]);

  useEffect(() => {
    const cTicks = [];
    if (data) {
      const yValues = data.map((d) => d.y);
      const min = Math.round(Math.min(...yValues) * 1000) / 1000;
      const max = Math.round(Math.max(...yValues) * 1000) / 1000;
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
      <ArgonBox p={1}>
        <ArgonTypography
          variant="h5"
          color="text"
          fontWeight="medium"
          sx={{ mt: 1 }}
          align="center"
        >
          {title}
        </ArgonTypography>
      </ArgonBox>

      <ResponsiveContainer width={"100%"} height={500} debounce={1}>
        <ComposedChart data={points} margin={chartMargins} ref={composedRef}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="top" height={48} />

          <XAxis
            dataKey="x"
            unit={unitX}
            padding={{ bottom: 30 }}
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={numOfXTicks}
            label={{
              value: xLabel,
              position: "bottom",
              offset: 0,
            }}
          />
          <YAxis
            dataKey="y"
            unit={unitY}
            tickSize={4}
            height={30}
            padding={{ left: 50 }}
            domain={yAxisDomain}
            allowDataOverflow={true}
            ticks={chartTicks}
            type="number"
            label={{ value: yLabel, angle: -90, position: "left" }}
          />
          <Scatter data={data} stroke="grey" fill="none" />
          <Line
            dataKey="loess"
            type="monotone"
            stroke="red"
            dot={false}
            activeDot={false}
            legendType="none"
            strokeWidth={4}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <ArgonBox m={3}>
        <Grid container justifyContent="center">
          <ArgonButton variant="gradient" color="primary" onClick={handleComposedDownload}>
            Download Scatter Chart with Loess Smoothing Curve
          </ArgonButton>
        </Grid>
      </ArgonBox>
    </ArgonBox>
  );
};

ScatterplotWithLoessCurve.defaultProps = {
  data: [{}],
  labels: {},
  units: {},
  loessline: [],
  title: "",
  numOfXTicks: 36,
};

ScatterplotWithLoessCurve.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  labels: PropTypes.object,
  units: PropTypes.object,
  loessline: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  numOfXTicks: PropTypes.number,
};

export default ScatterplotWithLoessCurve;
