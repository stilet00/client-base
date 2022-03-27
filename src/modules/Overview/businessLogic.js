import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { getBalance } from "../../services/balanceServices/services";
import { getClients } from "../../services/clientsServices/services";
import { getTranslators } from "../../services/translatorsServices/services";

export const useOverview = (user) => {
  const [clients, setClients] = useState([]);

  const [translators, setTranslators] = useState([]);

  const [progressStatus, setProgressStatus] = useState(true);

  const [progressValue, setProgressValue] = useState(null);

  const [yearSum, setYearSum] = useState(null);

  const [bestMonth, setBestMonth] = useState(null);

  const [arrayOfYears, setArrayOfYears] = useState([]);

  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

  const handleChange = useCallback((event) => {
    setSelectedYear(event.target.value);
  }, []);

  useEffect(() => {
    if (user) {
      getBalance().then((res) => {
        if (res.status === 200) {
          const yearList = res.data.map((item) => item.year);
          setArrayOfYears([...new Set(yearList.sort((a, b) => a - b))]);
          let byYearFilteredArray = res.data.filter(
            (item) => item.year === selectedYear
          );
          let sumSortedArray =
            getArrayWithSums(byYearFilteredArray).sort(compareSums);
          setBestMonth(sumSortedArray[sumSortedArray.length - 1]);
          getMonthProgress(byYearFilteredArray);
          getYearSum(byYearFilteredArray);
        }
      });

      getClients().then((res) => {
        if (res.status === 200) {
          setClients(res.data);
        }
      });

      getTranslators().then((res) => {
        if (res.status === 200) {
          setTranslators(res.data);
        }
      });
    }
  }, [selectedYear, user]);

  function getArrayWithSums(array) {
    return array.map((item) => {
      return { ...item, values: reduceArray(item.values) };
    });
  }

  function compareSums(a, b) {
    return a.values - b.values;
  }

  function reduceArray(array) {
    return array.length > 0
      ? array.reduce((sum, current) => {
          return Number(sum) + Number(current);
        })
      : null;
  }

  function getSumTillNow(array, forFullMonth = false) {
    let sum = 0;
    if (forFullMonth) {
      array?.values.forEach((item) => {
        sum = item ? sum + Number(item) : sum;
      });
    } else {
      if (array) {
        const dayNumber = Number(moment().format("DD"));
        if (dayNumber !== 1) {
          array.values.forEach((item, index) => {
            if (index < dayNumber - 1 && item) {
              sum = sum + Number(item);
            }
          });
        } else {
          array.values.forEach((item, index) => {
            if (index < dayNumber && item) {
              sum = sum + Number(item);
            }
          });
        }
      }
    }

    return sum;
  }

  function getYearSum(yearArray) {
    let arrayOfSums = [];
    yearArray.forEach((item) => {
      arrayOfSums.push(reduceArray(item.values));
    });
    setYearSum(reduceArray(arrayOfSums));
  }

  function getMonthProgress(yearArray) {
    let currentMonth = yearArray.find(
      (item) => item.month === moment().format("MM")
    );
    let previousMonthNumber =
      Number(moment().format("MM")) - 1 < 10
        ? "0" + (Number(moment().format("MM")) - 1)
        : moment().format("MM") - 1 + "";
    let previousMonth = yearArray.find(
      (item) => item.month === previousMonthNumber
    );
    if (!currentMonth) {
      currentMonth = yearArray[yearArray.length - 1];
      previousMonth = yearArray[yearArray.length - 2];
      let currentSum = getSumTillNow(currentMonth, true);
      let previousSum = getSumTillNow(previousMonth, true);
      if (currentSum > previousSum) {
        setProgressStatus(true);
        setProgressValue(
          Math.round(((currentSum - previousSum) * 100) / currentSum)
        );
      } else {
        setProgressStatus(false);
        setProgressValue(
          Math.round(((previousSum - currentSum) * 100) / previousSum)
        );
      }
    } else {
      let currentSum = getSumTillNow(currentMonth);
      let previousSum = getSumTillNow(previousMonth);
      if (currentSum > previousSum) {
        setProgressStatus(true);
        setProgressValue(
          Math.round(((currentSum - previousSum) * 100) / currentSum)
        );
      } else if (currentSum !== 0 && previousSum !== 0) {
        setProgressStatus(false);
        setProgressValue(
          Math.round(((previousSum - currentSum) * 100) / previousSum)
        );
      } else {
        setProgressStatus(false);
        setProgressValue(0);
      }
    }
  }

  return {
    progressValue,
    progressStatus,
    arrayOfYears,
    selectedYear,
    handleChange,
    clients,
    translators,
    bestMonth,
    yearSum,
  };
};
