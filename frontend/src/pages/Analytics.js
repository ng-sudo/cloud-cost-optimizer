import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, Spinner, Badge, Alert } from '../components/UI';
import { reportService } from '../services/api';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { reportId } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const data = await reportService.getCharts(reportId);
        setChartData(data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load charts');
      } finally {
        setLoading(false);
      }
    };
    fetchCharts();
  }, [reportId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            if (context.chart.config.type === 'doughnut') {
              return `${label}: $${value.toLocaleString()}`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3 text-muted">Loading analytics...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!chartData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No chart data available</Alert>
      </Container>
    );
  }

  // Prepare pie chart data
  const pieData = {
    labels: chartData.service_costs.map(s => s.service),
    datasets: [{
      data: chartData.service_costs.map(s => s.cost),
      backgroundColor: [
        '#0066cc', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
        '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  // Prepare bar chart data
  const barData = {
    labels: chartData.top_services.map(s => s.service),
    datasets: [{
      label: 'Total Cost ($)',
      data: chartData.top_services.map(s => s.cost),
      backgroundColor: '#0066cc',
      borderRadius: 6,
      borderSkipped: false
    }]
  };

  // Prepare line chart data
  const lineData = {
    labels: chartData.resource_costs.map(r => r.resource),
    datasets: [
      {
        label: 'Cost ($)',
        data: chartData.resource_costs.map(r => r.cost),
        borderColor: '#0066cc',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        yAxisID: 'y',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Utilization (%)',
        data: chartData.resource_costs.map(r => r.utilization),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        yAxisID: 'y1',
        tension: 0.3,
        fill: false,
        type: 'line'
      }
    ]
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: { type: 'linear', position: 'left', beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString() } },
      y1: { type: 'linear', position: 'right', beginAtZero: true, max: 100, grid: { drawOnChartArea: false }, ticks: { callback: v => v + '%' } }
    }
  };

  const totalCost = chartData.service_costs.reduce((sum, s) => sum + s.cost, 0);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cost Analytics</h2>
        <Badge variant="primary" className="fs-6">{chartData.service_costs.length} Services Analyzed</Badge>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="h-100">
            <CardHeader>Cost by Service (Pie Chart)</CardHeader>
            <CardBody>
              <div style={{ height: '350px' }}>
                <Doughnut data={pieData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <CardHeader>Top 5 Most Expensive Services (Bar Chart)</CardHeader>
            <CardBody>
              <div style={{ height: '350px' }}>
                <Bar data={barData} options={{
                  ...chartOptions,
                  scales: { y: { beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString() } } }
                }} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={12}>
          <Card>
            <CardHeader>Resource Costs & Utilization (Line Chart)</CardHeader>
            <CardBody>
              <div style={{ height: '400px' }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card>
            <CardHeader>Service Cost Breakdown</CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr><th>#</th><th>Service</th><th className="text-end">Cost</th><th className="text-end">% of Total</th></tr>
                  </thead>
                  <tbody>
                    {chartData.service_costs.map((item, i) => (
                      <tr key={i}>
                        <td><Badge variant="primary" className="me-2">{i + 1}</Badge>{item.service}</td>
                        <td className="text-end fw-bold">${item.cost.toLocaleString()}</td>
                        <td className="text-end text-muted">{((item.cost / totalCost) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <CardHeader>Top Resources by Cost</CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr><th>#</th><th>Resource</th><th className="text-end">Cost</th><th className="text-end">Utilization</th></tr>
                  </thead>
                  <tbody>
                    {chartData.resource_costs.slice(0, 10).map((item, i) => (
                      <tr key={i}>
                        <td><Badge variant="secondary" className="me-2">{i + 1}</Badge>{item.resource} <span className="text-muted small">({item.service})</span></td>
                        <td className="text-end fw-bold">${item.cost.toLocaleString()}</td>
                        <td className="text-end">
                          <Badge variant={item.utilization < 20 ? 'danger' : item.utilization < 40 ? 'warning' : item.utilization <= 80 ? 'success' : 'info'}>
                            {item.utilization}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;