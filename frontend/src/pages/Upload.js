import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Alert, Progress, Spinner, Badge } from '../components/UI';
import { reportService } from '../services/api';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');
    setResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const data = await reportService.upload(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
      
      setTimeout(() => {
        navigate(`/reports/${data.report.id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="mb-4">
            <CardHeader>
              <h3 className="mb-0">Upload Cloud Billing Report</h3>
            </CardHeader>
            <CardBody>
              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

              <div
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={uploading}
                  ref={fileInputRef}
                  className="d-none"
                />
                
                <div className="upload-icon">📄</div>
                <h4 className="mb-2">Drag & Drop CSV File Here</h4>
                <p className="text-muted mb-4">or click to browse</p>
                
                {!uploading && !result && (
                  <Button variant="primary" size="lg" onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                )}

                <p className="upload-hint mt-3">
                  <strong>Required CSV format:</strong> Service,Resource,Region,UsageHours,Utilization,Cost
                </p>
                <p className="upload-hint text-muted small">
                  Max file size: 10MB • No cloud credentials required
                </p>
              </div>

              {file && !uploading && !result && (
                <div className="mt-4 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{file.name}</strong>
                      <span className="text-muted ms-2">{formatBytes(file.size)}</span>
                    </div>
                    <Button variant="primary" size="lg" onClick={handleUpload} disabled={uploading}>
                      {uploading ? (
                        <>
                          <Spinner size="sm" />
                          Processing...
                        </>
                      ) : (
                        'Upload & Analyze'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Uploading & Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} max={100} className="mb-2" style={{ height: '8px' }} />
                  <p className="text-muted small mb-0">
                    {progress < 50 ? 'Reading CSV data...' : progress < 80 ? 'Analyzing costs...' : 'Generating recommendations...'}
                  </p>
                </div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-success bg-opacity-10 border border-success rounded">
                  <div className="d-flex align-items-center mb-3">
                    <span className="badge bg-success fs-6 me-3">✓ Success</span>
                    <h5 className="mb-0">Report processed successfully!</h5>
                  </div>
                  <div className="row g-3 text-center">
                    <div className="col-6 col-md-3">
                      <div className="fw-bold text-success">{result.report.valid_records}</div>
                      <div className="text-muted small">Valid Records</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="fw-bold text-danger">{result.report.invalid_rows}</div>
                      <div className="text-muted small">Invalid Rows</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="fw-bold text-primary">${parseFloat(result.report.total_cost || 0).toLocaleString()}</div>
                      <div className="text-muted small">Total Cost</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="fw-bold text-success">${parseFloat(result.report.estimated_savings || 0).toLocaleString()}</div>
                      <div className="text-muted small">Est. Savings</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <Button variant="success" size="lg" onClick={() => navigate(`/reports/${result.report.id}`)}>
                      View Full Analysis
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Sample CSV Format</CardHeader>
            <CardBody>
              <pre className="bg-dark text-light p-3 rounded small overflow-auto"><code>{`Service,Resource,Region,UsageHours,Utilization,Cost
EC2,WebServer-01,us-east-1,730,15,450.00
EC2,AppServer-02,us-east-1,730,68,520.00
S3,BackupBucket,us-east-1,0,100,120.00
RDS,PrimaryDB,us-east-1,730,42,680.00
Lambda,ImageProcessor,us-east-1,45,12,85.00
CloudFront,StaticCDN,us-east-1,0,95,230.00
DynamoDB,SessionTable,us-east-1,730,35,340.00
EC2,DevServer,us-west-2,180,8,180.00`}</code></pre>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Upload;