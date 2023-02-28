import * as stats from './stats';

const syncProgressAndScore = (assign, qualityTests, qualitySystems) => {
  let progressAnnString = '0',
    progressDaString = '0',
    scoreAnnString = '0',
    scoreDaString = '0';

  if (Object.keys(assign).length > 0) {
    // const audittype = assign.detailedaudit ? 'detailed' : 'annual';
    const annTests = [],
      daTests = [];
    assign.tests.forEach((test) => {
      const found = qualityTests.find((t) => t.code === test.test.slice(0, 7));
      if (found.system === 'Administration' || found.system === 'Defense') {
        daTests.push(test.test.slice(0, 7));
      } else {
        annTests.push(test.test.slice(0, 7));
      }
    });
    const completedAnnTests = assign.tests.filter(
      (test) => test.tested && annTests.includes(test.test.slice(0, 7))
    );
    const completedTests = assign.tests.filter((test) => test.tested);
    //Calculate Annual Audit Progress
    progressAnnString = (completedAnnTests.length / annTests.length)
      .toFixed(2)
      .toString();
    //Calculate Detailed Audit Progress --> matches the total progress of all tests
    progressDaString = (completedTests.length / assign.tests.length)
      .toFixed(2)
      .toString();

    //create an object containing all the quality scores by test dimension and test system
    let overallAnnScore = 0.0,
      overallDaScore = 0.0;
    if (completedTests.length > 0 && qualitySystems) {
      let qualityScoreObj = {};
      for (let i = 0; i < completedTests.length; i++) {
        const currentTest = qualityTests.find(
          (t) =>
            t.code === completedTests[i].test.replace(/\s+/g, '').split('-')[0]
        );
        const belongSystem = qualitySystems.find(
          (s) => s._id === currentTest.system._id
        );
        if (!qualityScoreObj.hasOwnProperty(belongSystem.systemname)) {
          qualityScoreObj[belongSystem.systemname] = {};
        }
        if (
          !qualityScoreObj[belongSystem.systemname].hasOwnProperty(
            currentTest.dimension
          )
        ) {
          qualityScoreObj[belongSystem.systemname][currentTest.dimension] = [];
        }
        qualityScoreObj[belongSystem.systemname][currentTest.dimension].push(
          completedTests[i].testscore
        );
      }

      //Loop through above object to calculate the weighted overall quality score for selected muni
      for (const system in qualityScoreObj) {
        let systemScore = 0.0;

        for (const dimension in qualityScoreObj[system]) {
          const meanScore = stats.calcMean(qualityScoreObj[system][dimension]);

          systemScore += meanScore;
        }
        const systemWeight = qualitySystems.find(
          (sys) => sys.systemname === system
        );
        if (systemWeight) {
          if (
            systemWeight.systemname === 'Data' ||
            systemWeight.systemname === 'Valuation'
          )
            overallAnnScore += systemScore * (systemWeight.annualweight / 100);
          overallDaScore += systemScore * (systemWeight.detailedweight / 100);
        }
      }
    } else {
      //setAlert('Check the test system name...', 'warning');
      overallAnnScore += 0.0;
      overallDaScore += 0.0;
    }
    scoreAnnString = overallAnnScore.toFixed(2).toString();
    scoreDaString = overallDaScore.toFixed(2).toString();
  }
  // setCurrent({
  //   ...assign,
  //   muniprogress: progressString,
  //   muniscore: scoreString,
  // });
  // setCurrentProgress(Math.round(parseFloat(progressString) * 100));
  // setCurrentQuality(Math.round(parseFloat(scoreString) * 100));
  return [progressAnnString, scoreAnnString, progressDaString, scoreDaString];
};
const _syncProgressAndScore = syncProgressAndScore;
export { _syncProgressAndScore as syncProgressAndScore };

export const ONEYEARSFDSALESMUNIS = [
  3, 19, 31, 35, 36, 43, 46, 48, 50, 69, 70, 86, 88, 91, 98, 100, 111, 117, 132,
  133, 148, 151, 180, 193, 194, 200, 201, 203, 206, 217, 224, 226, 238, 239,
  245, 247, 254, 262, 263, 264, 268, 269, 284, 291, 292, 293, 298, 301, 302,
  303, 305, 310, 311, 327, 335, 347, 348, 350, 356, 361, 376, 482, 505, 508,
  525, 532, 4353,
];

const getFilterTypeOfCols = (dataType) => {
  const filterTypeOfCols = {};
  if (dataType.toUpperCase() === 'IOV') {
    filterTypeOfCols.hiddenCols = [
      'ADJUSTMENT_DESC',
      'IOV_AP_COMBINE_ID',
      'IOV_AP_IDENTIFIER',
      'IOV_LTC_TITLE_DATE',
      'IOV_ROLL_TYPE_CODE',
      'MONTH_LABEL',
      'MUNI_CODE',
      'SALE_DATE',
      'VALUE_INDICATOR_DESC',
      'VERIFIN_DESC',
      'IMP_TYPE',
    ];
    filterTypeOfCols.selectFilters = [
      'ADJUSTMENT_CODE',
      'ASMNT_PROCEDURE_CODE',
      'AUD_USE_FLAG',
      'AUG_CODE',
      'IOV_AP_CREATED_BY',
      'IOV_GARAGE_FLAG',
      'LAST_AUDIT_FLAG',
      'NEW_IMP_FLAG',
      'PREV_ACTUAL_USE_GROUP_CODE',
      'PROP_SIZE_UOM',
      'REG_DOC_TYPE',
      'SALES_PERIOD',
      'USED_IN_AUDIT_FLAG',
      'VALUE_INDICATOR_TYPE',
      'VERIFIN_CODE',
      'VQ_CODE',
      'QUALITY_CODE',
      'CONDITION_CODE',
    ];
    filterTypeOfCols.fuzzyTextFilters = [
      'ADJUSTMENT_NARRATIVE',
      'ASMNT_PROCEDURE_NAME',
      'CERTIF_OF_TITLE',
      'IOV_LTC_COFT',
      'IOV_NARRATIVE',
      'ROLL_NBR',
      'MODEL_CODE',
      'STRUCTURE_CODE',
    ];
    filterTypeOfCols.sliderEqualFilters = [
      'MONTHS',
      'MULTI_RECORDS',
      'TOTAL_IMP_COUNTS',
    ];
    filterTypeOfCols.sliderGreaterThanFilters = [
      'ADJUSTED_PRICE',
      'ADJUSTMENT_AMOUNT',
      'COMBINED_PREV_TOTAL_ASMNT',
      'COMBINED_TOTAL_ASMNT',
      'LTC_CONSIDERATION',
      'LTC_VALUE',
      'OLDEST_IMP_EFFAGE',
      'OTHER_TOTAL_ADJUSTMENTS',
      'PREV_ANN_TOTAL_AP_ASMNT',
      'PREV_LAND_ASMNT',
      'PRICE',
      'PROPERTY_SIZE',
      'PROPERTY_SIZE_SF',
      'SAR',
      'TIME_ADJ_PCT',
      'TOTAL_ABOVE_GRADE_FLOOR_AREA',
      'TOTAL_AP_ASMNT',
      'TOTAL_TIME_ADJUSTMENT',
      'UNIT_ASMNT_VALUE',
      'UNIT_SALE_PRICE',
    ];
    filterTypeOfCols.numberRangeFilters = [];
  }
  if (dataType.toUpperCase() === 'ANN') {
    filterTypeOfCols.hiddenCols = [
      'ANN_ASSESS_PARTY',
      'AP_IDENTIFIER',
      'ASMNT_EFF_DATE',
      'ASMNT_ROLL_DATE',
      'ASSESSMENT_YEAR',
      'ATS_LEGAL_SUB_DIV_NBR',
      'ATS_MERIDIAN',
      'ATS_QUARTER_SECTION',
      'ATS_RANGE',
      'ATS_SECTION',
      'ATS_TOWNSHIP',
      'INSPECTION_DATE',
      'LAND_USE_LABEL',
      'LAND_USE_TYPE',
      'LINC_NBR',
      'MARKET_AREA_DESC',
      'MUNC_ADDRESS',
      'MUNICIPALITY_CODE',
      'MUNICIPALITY_NAME',
      'MUNICIPALITY_TYPE',
      'NEIGHBORHOOD_NAME',
      'PBL_BLOCK',
      'PBL_LOT',
      'PBL_PLAN',
      'IMP_TYPE',
    ];
    filterTypeOfCols.selectFilters = [
      'ASMNT_PROCEDURE_CODE',
      'ASMNT_ROLL_TYPE_CODE',
      'AUG_CODE',
      'GARAGE_FLAG',
      'INSPECTION_TYPE_CODE',
      'IOV_AUG',
      'MARKET_AREA_CODE',
      'NEIGHBORHOOD_CODE',
      'NEW_IMP_FLAG',
      'PREV_ACTUAL_USE_GROUP_CODE',
      'PROP_SIZE_UOM',
      'SOLD_STATUS',
      'USED_IN_AUDIT_FLAG',
      'VQ_CODE',
      'QUALITY_CODE',
      'CONDITION_CODE',
      'SALES_PERIOD',
    ];
    filterTypeOfCols.fuzzyTextFilters = [
      'PREDOM_ACTUAL_USE_CODE',
      'ROLL_NBR',
      'SECONDARY_ACTUAL_USE_CODE',
      'MODEL_CODE',
      'STRUCTURE_CODE',
    ];
    filterTypeOfCols.sliderEqualFilters = [
      'EFFAGEGP',
      'IMPSZGP',
      'LOTSZGP',
      'TOTAL_IMP_COUNTS',
      'VALUEGP',
    ];
    filterTypeOfCols.sliderGreaterThanFilters = [
      'ANN_FARMLAND_ASMNT',
      'ANN_IMP_ASMNT',
      'ANN_LAND_ASMNT',
      'IOV_ADJUSTED_PRICE',
      'IOV_TOTAL_ASMNT',
      'OLDEST_IMP_EFFAGE',
      'PREV_ANN_TOTAL_AP_ASMNT',
      'PREV_LAND_ASMNT',
      'PROPERTY_SIZE',
      'TOTAL_ABOVE_GRADE_FLOOR_AREA',
      'TOTAL_AP_ASMNT',
    ];
    filterTypeOfCols.numberRangeFilters = [];
  }
  if (dataType.toUpperCase() === 'LTC') {
    filterTypeOfCols.hiddenCols = [
      'LCOT_CONSIDER_TEXT',
      'LCOT_MUNC_LAND_LOCATED',
      'LCOT_REGISTRATION_DATE',
      'LCOT_TITLE_DATE',
      'LLS_SLD',
      'MUNCODE1',
      'MUNCODE2',
      'TVSX_AMA_CODE',
      'TVSX_LEGAL_NAME',
    ];
    filterTypeOfCols.selectFilters = [
      'LCOT_CANCELLATION_TYPE',
      'LCOT_HOW_FOUND',
      'LCOT_TITLE_YEAR',
      'MATCHIOVLTCFLAG',
      'REG_DOC_TYPE',
      'SALES_PERIOD',
    ];
    filterTypeOfCols.fuzzyTextFilters = ['LCOT_C_OF_T', 'LINC'];
    filterTypeOfCols.sliderEqualFilters = [];
    filterTypeOfCols.sliderGreaterThanFilters = [
      'LCOT_CONSIDER_AMOUNT',
      'LCOT_VALUE',
    ];
    filterTypeOfCols.numberRangeFilters = [];
  }

  return filterTypeOfCols;
};
const _getFilterTypeOfCols = getFilterTypeOfCols;
export { _getFilterTypeOfCols as getFilterTypeOfCols };
