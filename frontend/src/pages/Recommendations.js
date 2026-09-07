import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Badge, Table, Pagination, Alert, Spinner, Select } from '../components/UI';
import { reportService } from '../services/api';

const Recommendations = () => {
  const { reportId } = useParams();
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, page_size: pagination.pageSize };
      if (filter) params.action_type = filter;
      const response = await reportService.getRecommendations(reportId, params);
      setData(response);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page, pagination.pageSize, reportId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (value) => {
    setFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => { setPagination(prev => ({ ...prev, page })); };

  const formatCost = (cost) => '$' + parseFloat(cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getActionBadge = (action) => {
    switch (action) {
      case 'terminate': return <Badge variant="danger">Terminate</Badge>;
      case 'downsize': return <Badge variant="warning">Downsize</Badge>;
      case 'healthy': return <Badge variant="success">Healthy</Badge>;
      case 'scale_up': return <Badge variant="info">Scale Up</Badge>;
      default: return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical': return <Badge variant="danger">Critical</Badge>;
      case 'warning': return <Badge variant="warning">Warning</Badge>;
      case 'healthy': return <Badge variant="success">Healthy</Badge>;
      case 'high_utilization': return <Badge variant="info">High Utilization</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3 text-muted">Loading recommendations...</p>
        </div>
      </Container>
    );
  }

  const totalSavings = data.results.reduce((sum, r) => sum + parseFloat(r.estimated_savings || 0), 0);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>Optimization Recommendations</h2>
        <div className="d-flex gap-2 flex-wrap">
          <span className="badge bg-success fs-6 align-self-center">${totalSavings.toLocaleString()} Potential Savings</span>
          <Select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
          >
            <option value="">All Types</option>
            <option value="terminate">Terminate</option>
            <option value="downsize">Downsize</option>
            <option value="healthy">Healthy</option>
            <option value="scale_up">Scale Up</option>
          </Select>
        </div>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Card className="mb-4">
        <CardHeader>Summary</CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={3}>
              <div className="text-center p-3 bg-danger bg-opacity-10 rounded">
                <h4 className="text-danger">{data.results.filter(r => r.action_type === 'terminate').length}</h4>
                <small className="text-muted">Terminate</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                <h4 className="text-warning">{data.results.filter(r => r.action_type === 'downsize').length}</h4>
                <small className="text-muted">Downsize</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                <h4 className="text-success">{data.results.filter(r => r.action_type === 'healthy').length}</h4>
                <small className="text-muted">Healthy</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center p-3 bg-info bg-opacity-10 rounded">
                <h4 className="text-info">{data.results.filter(r => r.action_type === 'scale_up').length}</h4>
                <small className="text-muted">Scale Up</small>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {data.results.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No recommendations found for this report.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Service</th>
                      <th>Resource</th>
                      <th>Region</th>
                      <th className="text-end">Cost</th>
                      <th className="text-center">Utilization</th>
                      <th>Action</th>
                      <th className="text-end">Est. Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((row, i) => (
                      <tr key={row.id || i}>
                        <td>
                          <Badge variant="primary" className="me-2">{row.service_name}</Badge>
                        </td>
                        <td><strong>{row.resource_name}</strong></td>
                        <td>{row.region}</td>
                        <td className="text-end">{formatCost(row.cost)}</td>
                        <td className="text-center">
                          <Badge variant={row.utilization < 20 ? 'danger' : row.utilization < 40 ? 'warning' : row.utilization <= 80 ? 'success' : 'info'}>
                            {row.utilization}%
                          </Badge>
                        </td>
                        <td>{getActionBadge(row.action_type)}</td>
                        <td className="text-end fw-bold text-success">
                          {parseFloat(row.estimated_savings) > 0 ? formatCost(row.estimated_savings) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="p-3 border-top">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={Math.ceil(data.count / pagination.pageSize)}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recommendation Details</h5>
          <Button variant="outline-primary" size="sm" onClick={() => {
            const blob = new Blob([generateCSV(data.results)], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recommendations_${reportId}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}>
            Export CSV
          </Button>
        </CardHeader>
        <CardBody>
          <div className="accordion" id="recommendationsAccordion">
            {data.results.map((row, i) => (
              <div key={row.id || i} className="accordion-item">
                <h2 className="accordion-header" id={`heading-${i}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${i}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${i}`}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <div>
                        <Badge variant="primary" className="me-2">{row.service_name}</Badge>
                        <strong>{row.resource_name}</strong>
                        <span className="text-muted ms-2">({row.region})</span>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        {getActionBadge(row.action_type)}
                        <span className="fw-bold text-success ms-2">
                          {parseFloat(row.estimated_savings) > 0 ? formatCost(row.estimated_savings) : '—'}
                        </span>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id={`collapse-${i}`} className="accordion-collapse collapse" aria-labelledby={`heading-${i}`} data-bs-parent="#recommendationsAccordion">
                  <div className="accordion-body">
                    <p className="mb-2">{row.recommendation}</p>
                    <Row className="g-3">
                      <Col md={3}>
                        <strong>Current Cost:</strong> {formatCost(row.cost)}
                      </Col>
                      <Col md={3}>
                        <strong>Utilization:</strong> {row.utilization}%
                      </Col>
                      <Col md={3}>
                        <strong>Usage Hours:</strong> {parseFloat(row.usage_hours || 0).toLocaleString()}
                      </Col>
                      <Col md={3}>
                        <strong>Status:</strong> {getStatusBadge(row.status)}
                      </Col>
                    </Row>
                    {parseFloat(row.estimated_savings) > 0 && (
                      <div className="alert alert-success mt-3 mb-0">
                        <strong>Potential Monthly Savings:</strong> {formatCost(row.estimated_savings)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

const generateCSV = (data) => {
  const headers = ['Service', 'Resource', 'Region', 'Cost', 'Utilization %', 'Action', 'Recommendation', 'Estimated Savings', 'Status'];
  const rows = data.map(r => [
    r.service_name,
    r.resource_name,
    r.region,
    r.cost,
    r.utilization,
    r.action_type,
    r.recommendation.replace(/,/g, ';'),
    r.estimated_savings,
    r.status
  ]);
  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

export default Recommendations;