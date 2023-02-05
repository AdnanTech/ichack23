import logo from './logo.svg';
import './App.css';
import { Breadcrumb, Layout, Menu, theme, Col, Row  } from 'antd';
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

const pulseOptions = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: 95,
      suggestedMax: 100,
    },
  },
};

const respiratoryOptions = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 40,
    },
  },
};

const tempOptions = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: 33,
      suggestedMax: 42,
    },
  },
};

const plugins = [{
  beforeDraw: function(chart) {
    const ctx = chart.ctx;
    const canvas = chart.canvas;
    const chartArea = chart.chartArea;

    // Chart background
    var gradientBack = canvas.getContext("2d").createLinearGradient(0, 20, 0, 200);
    gradientBack.addColorStop(0, "red");
    gradientBack.addColorStop(0.14288, "blue");
    gradientBack.addColorStop(0.21429, "green");
    gradientBack.addColorStop(0.5, "yellow");
    gradientBack.addColorStop(0.64286, "red");
    gradientBack.addColorStop(0.785714, "yellow");
    gradientBack.addColorStop(1, "red");

    ctx.fillStyle = gradientBack;
    ctx.fillRect(chartArea.left, chartArea.bottom,
      chartArea.right - chartArea.left, chartArea.top - chartArea.bottom);
  }
}];

function App() {
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [timestamps2, setTimestamps2] = useState([]);
  const [pulseData, setPulseData] = useState([]);
  const [respiratory, setRespiratory] = useState([]);
  const [temp, setTemp] = useState([]);

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
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://127.0.0.1:5000/api/per_min")
        .then((response) => response.json())
        .then((data) => {
          setTimestamps2(timestamps2 => [...timestamps2, data.timestamp])
          setPulseData(pulseData => [...pulseData, data.pulse_ox])
          setRespiratory(respiratory => [...respiratory, data.respiratory])
          setTemp(temp => [...temp, data.temp])
        })
        .catch((err) => console.log(err));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);


  // useEffect(() => {
  //   let thirtyMinsTimestamps = [];
  //   let thirtyMinsData = [];
  //   let currTimeMark = (timestamps.length > 0 && (new Date(timestamps[0])).getMinutes() < 30) ? "0" : "1";
  //   let thirtyMinsIntervalData = [];
  //   for (let i = 0; i < Math.min(data.length, timestamps.length); i++) {
  //     let timestamp = new Date(timestamps[i])
  //     if ((timestamp.getMinutes() >= 30 && currTimeMark === "0") || (timestamp.getMinutes() < 30 && currTimeMark === "1")) {
  //       console.log("<1>")
  //       currTimeMark = (currTimeMark === "1") ? "0" : "1";
  //       if (currTimeMark === "0") {
  //         thirtyMinsTimestamps.push(timestamp.getHours() + ":00")
  //         currTimeMark = 1;
  //       } else {
  //         thirtyMinsTimestamps.push(timestamp.getHours() + ":30")
  //         currTimeMark = 0;
  //       }
  //       thirtyMinsData.push(thirtyMinsIntervalData.reduce((a, b) => a + b, 0) / thirtyMinsIntervalData.length);
  //     }
  //     console.log("<2>")
  //     thirtyMinsIntervalData.push(data[i]);
  //     console.log(thirtyMinsTimestamps, thirtyMinsData)
  //   }
  // }, [timestamps, data])

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
            pointBackgroundColor: data.map(colorCode),
            borderWidth: 0,
            pointRadius: 1,
            fill: false
          },
        ],
      });
    }
  }, [data, timestamps]);

  function colorCode(value) {
    if (value <= 40) {
      return "red"
    } else if (value > 40 && value < 50) {
      return "yellow"
    } else if (value > 50 && value < 90) {
      return "black"
    } else if (value > 90 && value < 110) {
      return "yellow"
    } else if (value > 110 && value < 130) {
      return "orange"
    } else {
      return "red"
    }
  }

  function compressDate(date) {
    let dateTime = new Date(date)
    return dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds()
  }

  const [pulseChartData, setPulseChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Pulse Oxygen",
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
    if (timestamps2.length) {
      setPulseChartData({
        labels: timestamps2.map(compressDate),
        datasets: [
          {
            label: "Pulse Oxygen",
            data: pulseData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
          },
        ],
      });
    }
  }, [timestamps2, pulseData]);

  const [respiratoryChartData, setRespiratoryChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Respiratory Rate",
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
    if (timestamps2.length) {
      setRespiratoryChartData({
        labels: timestamps2,
        datasets: [
          {
            label: "Respiratory Rate",
            data: respiratory,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
          },
        ],
      });
    }
  }, [timestamps2, respiratory]);


  const [tempChartData, setTempChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature",
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
    if (timestamps2.length) {
      setTempChartData({
        labels: timestamps2,
        datasets: [
          {
            label: "Temperature",
            data: temp,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
          },
        ],
      });
    }
  }, [timestamps2, temp]);


  
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
          <Row>
            <Col span={12}><Line data={chartData} options={options}/></Col>
            <Col span={12}><Line data={pulseChartData} options={pulseOptions}/></Col>
          </Row>
          <Row>
            <Col span={12}><Line data={respiratoryChartData} options={respiratoryOptions}/></Col>
            <Col span={12}><Line data={tempChartData} options={tempOptions}/></Col>
          </Row>
      </Layout>
    </Layout>
  );
}

export default App;
