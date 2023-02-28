import * as stats from "./stats";

const defineSalesTableColumns = (cols) => {
  /* Sale data columns: 
		id,assessment,saleDate,months,assrTaPct,salePrice,otherAdj,assrAdjPrice,
		totalImps,modelCode,quality,condition,age,bsmtAreaSF,lotSizeSF,
		nbhd,marketArea,prevAsmt,sar,floorAreaSF,unitSalePrice,audTaPct,audAdjPrice.
		****
		Output columns is an array of objects with below structure: (example)
		****
		 [
			{
				field: "id",
				headerName: "Id", could be pure string or unicode like "***\u00a0***"
				width: 100,
				align: "center",
headerAlign: "center",
				valueGetter: (params)=>params.row.id.toLocaleString("en-US"),
			},
			{
				field: "age",
				headerName: "Age", could be pure string or unicode like "***\u00a0***"
				width: 50,
				align: "center",
headerAlign: "center",
				valueGetter: (params)=>params.row.age.toFixed(0),
			},
			...
		 ]
	*/

  let outputCols = [];
  for (let i = 0; i < cols.length; i++) {
    switch (cols[i]) {
      case "id":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "id",
            headerName: "id",
            width: 80,
          });
        break;
      case "assessment":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "assessment",
            headerName: "assessment",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.assessment.toFixed(0),
          });
        break;
      case "saleDate":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "saleDate",
            headerName: "saleDate",
            width: 110,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => {
              const dt = new Date(Date.UTC(0, 0, params.row.saleDate - 1));
              return dt.toLocaleDateString("en-US");
            },
          });
        break;
      case "months":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "months",
            headerName: "months",
            width: 80,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.months.toFixed(0),
          });
        break;
      case "assrTaPct":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "assrTaPct",
            headerName: "assrTaPct",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.assrTaPct.toFixed(2),
          });
        break;
      case "salePrice":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "salePrice",
            headerName: "salePrice",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.salePrice.toFixed(0),
          });
        break;
      case "otherAdj":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "otherAdj",
            headerName: "otherAdj",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.otherAdj.toFixed(0),
          });
        break;
      case "assrAdjPrice":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "assrAdjPrice",
            headerName: "assrAdjPrice",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.assrAdjPrice.toFixed(0),
          });
        break;
      case "totalImps":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "totalImps",
            headerName: "totalImps",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.totalImps.toFixed(0),
          });
        break;
      case "modelCode":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "modelCode",
            headerName: "modelCode",
            width: 100,
          });
        break;
      case "quality":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "quality",
            headerName: "quality",
            width: 100,
          });
        break;
      case "condition":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "condition",
            headerName: "condition",
            width: 100,
          });
        break;
      case "age":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "age",
            headerName: "age",
            width: 50,
          });
        break;
      case "bsmtAreaSF":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "bsmtAreaSF",
            headerName: "bsmtAreaSF",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.bsmtAreaSF.toFixed(0),
          });
        break;
      case "lotSizeSF":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "lotSizeSF",
            headerName: "lotSizeSF",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.lotSizeSF.toFixed(0),
          });
        break;
      case "landUse":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "landUse",
            headerName: "landUse",
            width: 80,
          });
        break;
      case "nbhd":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "nbhd",
            headerName: "nbhd",
            width: 80,
          });
        break;
      case "marketArea":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "marketArea",
            headerName: "marketArea",
            width: 100,
          });
        break;
      case "prevAsmt":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "prevAsmt",
            headerName: "prevAsmt",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.prevAsmt.toFixed(0),
          });
        break;
      case "sar":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "sar",
            headerName: "sar",
            width: 80,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.sar.toFixed(3),
          });
        break;
      case "floorAreaSF":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "floorAreaSF",
            headerName: "floorAreaSF",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.floorAreaSF.toFixed(0),
          });
        break;
      case "unitSalePrice":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "unitSalePrice",
            headerName: "unitSalePrice",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.unitSalePrice.toFixed(2),
          });
        break;
      case "audTaPct":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "audTaPct",
            headerName: "audTaPct",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.audTaPct.toFixed(2),
          });
        break;
      case "audAdjPrice":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "audAdjPrice",
            headerName: "audAdjPrice",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.audAdjPrice.toFixed(0),
          });
        break;
      case "predictedValue":
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: "predictedValue",
            headerName: "predictedValue",
            width: 100,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => params.row.predictedValue.toFixed(0),
          });
        break;
      default:
        if (!keyExists(cols[i], outputCols))
          outputCols.push({
            field: cols[i],
            headerName: cols[i],
            width: 80,
            // valueGetter: (params) =>
            //   typeof params.row[cols[i]] === "number"
            //     ? params.row[cols[i]].toFixed(2)
            //     : params.row[cols[i]],
          });
        break;
    }
  }
  return outputCols;
};
const _defineSalesTableColumns = defineSalesTableColumns;
export { _defineSalesTableColumns as defineSalesTableColumns };

const keyExists = (key, arr) => {
  let found = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === key) found = true;
  }
  return found;
};
const _keyExists = keyExists;
export { _keyExists as keyExists };

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const _capitalizeFirstLetter = capitalizeFirstLetter;
export { _capitalizeFirstLetter as capitalizeFirstLetter };
