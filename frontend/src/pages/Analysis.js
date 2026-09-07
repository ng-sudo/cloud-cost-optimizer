import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, Badge, Table, Pagination, Alert, Spinner, Input, Select, FormGroup } from '../components/UI';
import { reportService } from '../services/api';

const Analysis = () => {
  const { reportId } = useParams();
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    service: '',
    minCost: '',
    maxCost: '',
    minUtil: '',
    maxUtil: '',
    ordering: '-cost'
  });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const [regions, setRegions] = useState([]);
  const [services, setServices] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, page_size: pagination.pageSize, ...filters };
      Object.keys(params).forEach(key => params[key] === '' && delete params[key]);
      const response = await reportService.getResources(reportId, params);
      setData(response);
      if (response.results) {
        setRegions([...new Set(response.results.map(r => r.region).filter(Boolean))]);
        setServices([...new Set(response.results.map(r => r.service_name).filter(Boolean))]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize, reportId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => { setPagination(prev => ({ ...prev, page })); };

  const formatCost = (cost) => '$' + parseFloat(cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getUtilizationBadge = (util) => {
    const u = parseFloat(util);
    if (u < 20) return <Badge variant="danger">{util}%</Badge>;
    if (u < 40) return <Badge variant="warning">{util}%</Badge>;
    if (u <= 80) return <Badge variant="success">{util}%</Badge>;
    return <Badge variant="info">{util}%</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3 text-muted">Loading cost analysis...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>Cost Analysis</h2>
        <span className="badge bg-primary fs-6">{data.count} Resources</span>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Card className="mb-4">
        <CardHeader>Filters</CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col md={3}>
              <FormGroup>
                <Input
                  placeholder="Search service, resource, region..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="form-select"
                >
                  <option value="">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Select
                  value={filters.service}
                  onChange={(e) => handleFilterChange('service', e.target.value)}
                  className="form-select"
                >
                  <option value="">All Services</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Input
                  type="number"
                  placeholder="Min Cost"
                  value={filters.minCost}
                  onChange={(e) => handleFilterChange('minCost', e.target.value)}
                  className="form-control"
                  step="0.01"
                />
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Input
                  type="number"
                  placeholder="Max Cost"
                  value={filters.maxCost}
                  onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                  className="form-control"
                  step="0.01"
                />
              </FormGroup>
            </Col>
            <Col md={1}>
              <FormGroup>
                <Select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="form-select"
                >
                  <option value="-cost">Cost ↓</option>
                  <option value="cost">Cost ↑</option>
                  <option value="-utilization_percentage">Utilization ↓</option>
                  <option value="utilization_percentage">Utilization ↑</option>
                  <option value="service_name">Service ↑</option>
                  <option value="-service_name">Service ↓</option>
                  <option value="resource_name">Resource ↑</option>
                  <option value="-resource_name">Resource ↓</option>
                </Select>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {data.results.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No resources found matching your criteria.</p>
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
                    {data.results.map((row, i) => (
                      <tr key={row.id || i}>
                        <td>
                          <Badge variant="primary" className="me-2">{row.service_name}</Badge>
                        </td>
                        <td><strong>{row.resource_name}</strong></td>
                        <td>{row.region}</td>
                        <td className="text-end">{parseFloat(row.usage_hours).toLocaleString()}</td>
                        <td className="text-center">{getUtilizationBadge(row.utilization_percentage)}</td>
                        <td className="text-end fw-bold">{formatCost(row.cost)}</td>
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
    </Container>
  );
};

export default Analysis;