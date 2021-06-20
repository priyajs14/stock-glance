import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useEasybase } from 'easybase-react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { mockData } from '../mockData';

function Dashboard() {
  const { getUserAttributes } = useEasybase();
  const chart = useRef(null);

  const [stockData, setStockData] = useState(mockData);
  const [selectedStock, setSelectedStock] = useState({}); // stores data of the current selected stock
  const [stockOptions, setStockOptions] = useState([]); // stores all the stocks that the user can view
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getUserAttributes().then((data) => {
      const stockArray = data.stocks.split(',');
      setStockOptions(stockArray);
      setIsAdmin(data.role === 'admin');
      setSelectedStock(getFilteredResult(stockArray[0]));
    });
  }, []);

  useLayoutEffect(() => {
    let x = am4core.create('chartdiv', am4charts.XYChart);

    x.paddingRight = 20;

    x.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

    let dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    let series = x.series.push(new am4charts.CandlestickSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'close';
    series.dataFields.openValueY = 'open';
    series.dataFields.lowValueY = 'low';
    series.dataFields.highValueY = 'high';
    series.simplifiedProcessing = true;
    // series.tooltipText = `Open:${openValueY.value}\nLow:${lowValueY.value}\nHigh:${highValueY.value}\nClose:${valueY.value}`;

    x.cursor = new am4charts.XYCursor();

    // a separate series for scrollbar
    let lineSeries = x.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.dateX = 'date';
    lineSeries.dataFields.valueY = 'close';
    // need to set on default state, as initially series is "show"
    lineSeries.defaultState.properties.visible = false;

    // hide from legend too (in case there is one)
    lineSeries.hiddenInLegend = true;
    lineSeries.fillOpacity = 0.5;
    lineSeries.strokeOpacity = 0.5;

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(lineSeries);
    x.scrollbarX = scrollbarX;

    x.data = selectedStock?.data;
    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [selectedStock]);

  const getFilteredResult = (key = null) => {
    const compareKey = key || selectedStock.symbol;
    const result = stockData.filter((stocks) => stocks.symbol === compareKey);
    return result[0];
  };

  const updateStockData = (quantity) => {
    const data = stockData.map((stock) => {
      if (stock.symbol === selectedStock?.symbol) {
        stock.quantityPurchased = quantity;
      }
      return stock;
    });
    setStockData(data);
    setSelectedStock(getFilteredResult());
  };

  return (
    stockOptions && (
      <div className="dashboard">
        <select
          name="category"
          value={selectedStock?.symbol}
          onChange={(event) =>
            setSelectedStock(getFilteredResult(event.target.value))
          }
        >
          {stockOptions.map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>
        <p>
          Stock currently viewing {selectedStock?.symbol} with{' '}
          {selectedStock?.quantityPurchased} quantity purchased
        </p>
        {isAdmin && (
          <label>
            Update Quantity:
            <input
              type="number"
              value={selectedStock?.quantityPurchased}
              onChange={(event) => updateStockData(event.target.value)}
            />
          </label>
        )}
        <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
      </div>
    )
  );
}

export default Dashboard;
