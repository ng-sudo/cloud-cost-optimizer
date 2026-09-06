import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Card, CardBody, Button, Badge, Alert, Spinner } from '../components/UI';
import { reportService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          reportService.getDashboard(),
          reportService.list()
        ]);
        setStats(statsData);
        setReports(reportsData);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  const statCards = [
    { label: 'Total Cost', value: stats?.total_cost ? `$${parseFloat(stats.total_cost).toLocaleString()}` : '$0', variant: 'primary', icon: '$' },
    { label: 'Total Resources', value: stats?.total_resources || '0', variant: 'success', icon: '📦' },
    { label: 'Services', value: stats?.total_services || '0', variant: 'info', icon: '⚙️' },
    { label: 'Avg Utilization', value: stats?.avg_utilization ? `${parseFloat(stats.avg_utilization).toFixed(1)}%` : '0%', variant: 'warning', icon: '📊' },
    { label: 'Highest Cost Service', value: stats?.highest_cost_service || 'N/A', variant: 'secondary', icon: '🔝' },
    { label: 'Estimated Savings', value: stats?.estimated_savings ? `$${parseFloat(stats.estimated_savings).toLocaleString()}` : '$0', variant: 'danger', icon: '💰' },
  ];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1>Dashboard</h1>
        <div>
          <span className="me-3">Welcome, {user?.first_name || user?.username}</span>
        </div>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row className="g-3 mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} xl={2} md={4} sm={6}>
            <Card className={`border-${stat.variant} h-100`}>
              <CardBody className="text-center">
                <div className="stat-icon text-muted mb-2" style={{ fontSize: '2rem' }}>{stat.icon}</div>
                <div className="stat-value fw-bold text-{stat.variant} fs-4">{stat.value}</div>
                <div className="stat-label text-muted small">{stat.label}</div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {reports.length > 0 && (
        <Card>
          <CardBody>
            <h5 className="mb-3">Recent Reports</h5>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Report</th>
                    <th>Uploaded</th>
                    <th>Records</th>
                    <th>Total Cost</th>
                    <th>Est. Savings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map(report => (
                    <tr key={report.id}>
                      <td>
                        <Badge variant="primary">{report.original_filename}</Badge>
                      </td>
                      <td>{new Date(report.uploaded_at).toLocaleDateString()}</td>
                      <td>{report.total_records}</td>
                      <td className="fw-bold">${parseFloat(report.total_cost || 0).toLocaleString()}</td>
                      <td className="text-success fw-bold">${parseFloat(report.estimated_savings || 0).toLocaleString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" as={Link} to={`/reports/${report.id}`}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-3">
              <Button variant="outline-primary" as={Link} to="/reports">View All Reports</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Row className="g-3 mt-4">
        <Col md={6}>
          <Card>
            <CardBody className="text-center py-5">
              <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>📤</div>
              <h4>Upload New Report</h4>
              <p className="text-muted">Analyze a new cloud billing CSV</p>
              <Button variant="primary" as={Link} to="/upload" className="mt-2">Upload Report</Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody className="text-center py-5">
              <div className="text-success mb-3" style={{ fontSize: '3rem' }}>📊</div>
              <h4>View Analytics</h4>
              <p className="text-muted">Explore detailed cost visualizations</p>
              <Button variant="success" as={Link} to="/analytics" className="mt-2" disabled={reports.length === 0}>
                View Analytics
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;