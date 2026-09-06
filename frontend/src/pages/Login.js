import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from '../components/UI';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error.response?.data?.detail || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <CardBody>
                <div className="text-center mb-4">
                  <h2>Welcome Back</h2>
                  <p className="text-muted">Sign in to your Cloud Cost Optimizer account</p>
                </div>

                {generalError && <Alert variant="danger" dismissible onClose={() => setGeneralError('')}>{generalError}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      placeholder="you@example.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      invalid={!!errors.password}
                      placeholder="••••••••"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </FormGroup>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="remember" />
                      <label className="form-check-label" htmlFor="remember">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                  </div>

                  <Button type="submit" variant="primary" block size="lg" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="mb-0">Don't have an account? <Link to="/register">Create one</Link></p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;