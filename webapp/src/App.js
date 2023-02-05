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
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      suggestedMin: 30,
      suggestedMax: 150,
    },
  },
};

const pulseOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      suggestedMin: 40,
      suggestedMax: 100,
    },
  },
};

const respiratoryOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 40,
    },
  },
};

const tempOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      suggestedMin: 33,
      suggestedMax: 42,
    },
  },
};


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
    }, 250);
    return () => clearInterval(intervalId);
  }, []);


  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
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
        labels: timestamps.map(compressDate),
        datasets: [
          {
            data: data,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            pointBackgroundColor: data.map(colorCodePulse),
            borderWidth: 0,
            pointRadius: 1,
            fill: false
          },
        ],
      });
    }
  }, [data, timestamps]);

  function colorCodePulse(value) {
    if (value <= 40) {
      return "#DA2C43"
    } else if (value > 40 && value <= 50) {
      return "#FFC107"
    } else if (value > 50 && value <= 90) {
      return "green"
    } else if (value > 90 && value <= 110) {
      return "#FFC107"
    } else if (value > 110 && value <= 130) {
      return "orange"
    } else {
      return "#DA2C43"
    }
  }

  function colorCodeRespiratory(value) {
    if (value <= 8) {
      return "#DA2C43"
    } else if (value > 8 && value <= 11) {
      return "#FFC107"
    } else if (value > 11 && value <= 20) {
      return "green"
    } else if (value > 20 && value <= 24) {
      return "#FFC107"
    } else {
      return "#DA2C43"
    }
  }

  function colorCodeTemp(value) {
    if (value <= 35) {
      return "#DA2C43"
    } else if (value > 35 && value <= 36) {
      return "#FFC107"
    } else if (value > 36 && value <= 38) {
      return "green"
    } else if (value > 38 && value <= 39) {
      return "#FFC107"
    } else {
      return "#DA2C43"
    }
  }

  function colorCodeOxygen(value) {
    if (value <= 91) {
      return "#DA2C43"
    } else if (value > 91 && value <= 93) {
      return "orange"
    } else if (value > 93 && value <= 95) {
      return "#FFC107"
    } else {
      return "green"
    }
  }

  function compressDate(date) {
    let dateTime = new Date(date)
    return padNum(dateTime.getHours()) + ":" + padNum(dateTime.getMinutes()) + ":" + padNum(dateTime.getSeconds())
  }

  function padNum(num) {
    let lenStr = String(num)
    if (lenStr.length == 2) {
      return lenStr
    } else {
      return '0' + lenStr 
    }
  }

  const [pulseChartData, setPulseChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Oxygen Saturation",
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
        labels: timestamps2,
        datasets: [
          {
            label: "Oxygen Saturation",
            data: pulseData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            pointBackgroundColor: pulseData.map(colorCodeOxygen),
            borderWidth: 0,
            pointRadius: 2,
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
            pointBackgroundColor: respiratory.map(colorCodeRespiratory),
            borderWidth: 0,
            pointRadius: 2,
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
            pointBackgroundColor: temp.map(colorCodeTemp),
            borderWidth: 0,
            pointRadius: 2,
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
            <Col span={12}>
              <><h2 style={{margin: 20}}>Heart Rate</h2><Line data={chartData} options={options}/></>
            </Col>
            <Col span={12}>
              <><h2 style={{margin: 20}}>Oxygen Saturation</h2><Line data={pulseChartData} options={pulseOptions}/></>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <><h2 style={{margin: 20}}>Respiratory Rate</h2><Line data={respiratoryChartData} options={respiratoryOptions}/></>
            </Col>
            <Col span={12}>
              <><h2 style={{margin: 20}}>Temperature</h2><Line data={tempChartData} options={tempOptions}/></>
            </Col>
          </Row>
      </Layout>
    </Layout>
  );
}

export default App;
