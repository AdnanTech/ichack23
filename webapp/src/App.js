import logo from './logo.svg';
import './App.css';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import React, { useState, useEffect } from "react";

const { Header, Content, Footer, Sider } = Layout;

Chart.register(...registerables);

const options = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: 30,
      suggestedMax: 150,
    },
  },
};

const plugins = [{
  beforeDraw: function(chart) {
    const ctx = chart.ctx;
    const canvas = chart.canvas;
    const chartArea = chart.chartArea;

    // Chart background
    var gradientBack = canvas.getContext("2d").createLinearGradient(0, 250, 0, 0);
    gradientBack.addColorStop(0, "rgba(251,221,221,1)");
    gradientBack.addColorStop(0.14288, "rgba(213,235,248,1");
    gradientBack.addColorStop(0.21429, "rgba(226,245,234,1)");
    gradientBack.addColorStop(0.5, "rgba(226,245,234,1)");
    gradientBack.addColorStop(0.64286, "rgba(252,244,219,1)");
    gradientBack.addColorStop(0.785714, "rgba(213,235,248,1)");
    gradientBack.addColorStop(1, "rgba(251,221,221,1)");

    ctx.fillStyle = gradientBack;
    ctx.fillRect(chartArea.left, chartArea.bottom,
      chartArea.right - chartArea.left, chartArea.top - chartArea.bottom);
  }
}];

function App() {
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:3000/api/hr")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));

      fetch("http://localhost:3000/api/timestamps")
        .then((response) => response.json())
        .then((timestamps) => setTimestamps(timestamps))
        .catch((err) => console.log(err));
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let thirtyMinsTimestamps = [];
    let thirtyMinsData = [];
    let currTimeMark = (timestamps.length > 0 && (new Date(timestamps[0])).getMinutes() < 30) ? "0" : "1";
    let thirtyMinsIntervalData = [];
    for (let i = 0; i < Math.min(data.length, timestamps.length); i++) {
      let timestamp = new Date(timestamps[i])
      if ((timestamp.getMinutes() >= 30 && currTimeMark === "0") || (timestamp.getMinutes() < 30 && currTimeMark === "1")) {
        console.log("<1>")
        currTimeMark = (currTimeMark === "1") ? "0" : "1";
        if (currTimeMark === "0") {
          thirtyMinsTimestamps.push(timestamp.getHours() + ":00")
          currTimeMark = 1;
        } else {
          thirtyMinsTimestamps.push(timestamp.getHours() + ":30")
          currTimeMark = 0;
        }
        thirtyMinsData.push(thirtyMinsIntervalData.reduce((a, b) => a + b, 0) / thirtyMinsIntervalData.length);
      }
      console.log("<2>")
      thirtyMinsIntervalData.push(data[i]);
      console.log(thirtyMinsTimestamps, thirtyMinsData)
    }
  }, [timestamps, data])

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart rate",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (data.length && timestamps.length) {
      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: "Heart rate",
            data: data,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
          },
        ],
      });
    }
  }, [data, timestamps]);

  
  return (
    <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      <Sider>
        <div style={{ height: 60, margin: 25}}>
            <h1 style={{color: "white", width: "100%", fontSize: 18}}>RecoveryChecker</h1>
        </div>
        <Menu theme="dark" selectedKeys='patient-1' mode="inline">
          <Menu.Item key='patient-1'>
            <span>Patient 1</span>
          </Menu.Item>
          <Menu.Item key='patient-2'>
            <span>Patient 2</span>
          </Menu.Item>
          <Menu.Item key='patient-3'>
            <span>Patient 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
          <Header style={{ padding: 0, background: '#F5F5F5', textAlign: 'center', fontWeight: 'bold', fontSize: 25 }}>Patient Data</Header>
          <Line data={chartData} options={options} plugins={plugins} />
      </Layout>
    </Layout>
  );
}

export default App;
