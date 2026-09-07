import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Badge, Alert, Spinner, Table, Pagination } from '../components/UI';
import { reportService } from '../services/api';

const ReportDetail = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [resources, setResources] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportData, resourcesData] = await Promise.all([
          reportService.get(reportId),
          reportService.getResources(reportId, { page: pagination.page, page_size: pagination.pageSize })
        ]);
        setReport(reportData);
        setResources(resourcesData);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pagination.page, pagination.pageSize, reportId]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const formatCost = (cost) => '$' + parseFloat(cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getUtilizationBadge = (util) => {
    const u = parseFloat(util);
    if (u < 20) return <Badge variant="danger">{u}%</Badge>;
    if (u < 40) return <Badge variant="warning">{u}%</Badge>;
    if (u <= 80) return <Badge variant="success">{u}%</Badge>;
    return <Badge variant="info">{u}%</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3 text-muted">Loading report...</p>
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

  if (!report) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Report not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1>{report.original_filename}</h1>
          <p className="text-muted mb-0">Uploaded: {new Date(report.uploaded_at).toLocaleString()}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" as={Link} to={`/analysis/${reportId}`}>Cost Analysis</Button>
          <Button variant="outline-success" as={Link} to={`/recommendations/${reportId}`}>Recommendations</Button>
          <Button variant="outline-info" as={Link} to={`/analytics/${reportId}`}>Analytics</Button>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-primary">
            <CardBody className="text-center">
              <div className="fw-bold text-primary fs-3">${parseFloat(report.total_cost || 0).toLocaleString()}</div>
              <div className="text-muted small">Total Cost</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-success">
            <CardBody className="text-center">
              <div className="fw-bold text-success fs-3">{report.total_records}</div>
              <div className="text-muted small">Resources</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-info">
            <CardBody className="text-center">
              <div className="fw-bold text-info fs-3">{report.total_services}</div>
              <div className="text-muted small">Services</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-danger">
            <CardBody className="text-center">
              <div className="fw-bold text-danger fs-3">${parseFloat(report.estimated_savings || 0).toLocaleString()}</div>
              <div className="text-muted small">Est. Savings</div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Resources</h5>
          <span className="badge bg-primary">{resources.count} total</span>
        </CardHeader>
        <CardBody className="p-0">
          {resources.results.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <p className="mb-0">No resources found in this report.</p>
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
                      <th className="text-end">Usage Hours</th>
                      <th className="text-center">Utilization</th>
                      <th className="text-end">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.results.map((resource, i) => (
                      <tr key={resource.id || i}>
                        <td><Badge variant="primary">{resource.service_name}</Badge></td>
                        <td><strong>{resource.resource_name}</strong></td>
                        <td>{resource.region}</td>
                        <td className="text-end">{parseFloat(resource.usage_hours).toLocaleString()}</td>
                        <td className="text-center">{getUtilizationBadge(resource.utilization_percentage)}</td>
                        <td className="text-end fw-bold">{formatCost(resource.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {resources.count > pagination.pageSize && (
                <div className="p-3 border-top">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(resources.count / pagination.pageSize)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default ReportDetail;