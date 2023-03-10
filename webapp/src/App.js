import logo from './logo.svg';
import './App.css';
import { Breadcrumb, Layout, Menu, theme, Col, Row, Table, Tag  } from 'antd';
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

  const [hrScore, setHrScore] = useState(0)
  const [oxyScore, setOxyScore] = useState(0)
  const [respiratoryScore, setRespiratoryScore] = useState(0)
  const [tempScore, setTempScore] = useState(0)

  const [warningData, setWarningData] = useState([])

  const columns = [
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            return (
              <Tag color={"red"} key={"red"}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Datetime',
      dataIndex: 'datetime',
      key: 'datetime',
    },
    {
      title: 'Heart Rate',
      dataIndex: 'heartRate',
      key: 'heartRate',
    },
    {
      title: 'Oxygen Saturation',
      dataIndex: 'oxy',
      key: 'oxy',
    },
    {
      title: 'Temperature',
      dataIndex: 'temp',
      key: 'temp',
    },
    {
      title: 'Respiratory Rate',
      dataIndex: 'respiratory',
      key: 'respiratory',
    },
    {
      title: 'NEWS',
      dataIndex: 'news',
      key: 'news',
    },
  ]

  const data2 = [
    {
      key: '1',
      tags: ['Warning'],
      datetime: (new Date()).toString(),
      heartRate: 80,
      oxy: 50,
      temp: 20,
      respiratory: 70,
      news: 10,
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:3000/api/hr")
        .then((response) => response.json())
        .then((data) => {
          setData(data)
          let lastData = data.at(-1)
          if (lastData <= 40 || lastData > 130) {
            setHrScore(3)
          } else if ((lastData > 40 && lastData <= 50) || (lastData > 90 && lastData <= 110)) {
            setHrScore(1)
          } else if (lastData > 50 && lastData <= 90) {
            setHrScore(0)
          } else if (lastData > 110 && lastData <= 130) {
            setHrScore(2)
          }
        })
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

          if (data.pulse_ox <= 91) {
            setOxyScore(3)
          } else if (data.pulse_ox > 91 && data.pulse_ox <= 93) {
            setOxyScore(2)
          } else if (data.pulse_ox > 91 && data.pulse_ox <= 93) {
            setOxyScore(1)
          } else {
            setOxyScore(0)
          }

          if (data.respiratory <= 8) {
            setRespiratoryScore(3)
          } else if (data.respiratory > 8 && data.respiratory <= 11) {
            setRespiratoryScore(1)
          } else if (data.respiratory > 11 && data.respiratory <= 20) {
            setRespiratoryScore(0)
          } else if (data.respiratory > 20 && data.respiratory <= 24) {
            setRespiratoryScore(2)
          } else {
            setRespiratoryScore(3)
          }

          if (data.temp <= 35) {
            setTempScore(3)
          } else if (data.temp > 35 && data.temp <= 36) {
            setTempScore(1)
          } else if (data.temp > 36 && data.temp <= 38) {
            setTempScore(0)
          } else if (data.temp > 38 && data.temp <= 39) {
            setTempScore(1)
          } else {
            setTempScore(2)
          }
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
    if (hrScore + oxyScore + tempScore + respiratoryScore > 2) {
      setWarningData(warningData => [...warningData, {
          key: (new Date()).toString(),
          tags: ['Warning'],
          datetime: (new Date()).toString(),
          heartRate: data.at(-1),
          oxy: pulseData.at(-1),
          temp: temp.at(-1),
          respiratory: respiratory.at(-1),
          news: hrScore + oxyScore + tempScore + respiratoryScore,
        },
      ])

      fetch("http://127.0.0.1:5000/api/send_sms")
    }

  }, [hrScore, oxyScore, tempScore, respiratoryScore])

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
      <Sider style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}>
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
      <Layout style={{ marginLeft: 250 }}>
          <Header style={{ padding: 0, background: '#F5F5F5', textAlign: 'center', fontWeight: 'bold', fontSize: 25 }}>Patient Data</Header>
          <Row>
            <Col span={12}>
              <>
                <Row>
                  <Col><h2 style={{margin: 20}}>Heart Rate</h2></Col>
                  <Col><h2 style={{margin: 20, textAlign: "right"}}>{hrScore}</h2></Col>
                </Row>
                <Line data={chartData} options={options}/>
              </>
            </Col>
            <Col span={12}>
              <>
                <Row>
                  <Col><h2 style={{margin: 20}}>Oxygen Saturation</h2></Col>
                  <Col><h2 style={{margin: 20, textAlign: "right"}}>{oxyScore}</h2></Col>
                </Row>
                <Line data={pulseChartData} options={pulseOptions}/>
              </>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <>
                <Row>
                  <Col><h2 style={{margin: 20}}>Respiratory Rate</h2></Col>
                  <Col><h2 style={{margin: 20, textAlign: "right"}}>{respiratoryScore}</h2></Col>
                </Row>
                <Line data={respiratoryChartData} options={respiratoryOptions}/>
              </>
            </Col>
            <Col span={12}>
              <>
                <Row>
                  <Col><h2 style={{margin: 20}}>Temperature</h2></Col>
                  <Col><h2 style={{margin: 20, textAlign: "right"}}>{tempScore}</h2></Col>
                </Row>
                <Line data={tempChartData} options={tempOptions}/>
              </>
            </Col>
          </Row>

          <Header style={{ padding: 0, background: '#F5F5F5', textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingVertical:20, opacity: 0 }}>Warnings</Header>

          <div></div>
          <Table columns={columns} dataSource={warningData} />
      </Layout>
    </Layout>
  );
}

export default App;
