import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from '../components/UI';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');

    try {
      await register({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (error) {
      setGeneralError(error.response?.data?.detail || error.message || 'Registration failed. Please try again.');
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
                  <h2>Create Account</h2>
                  <p className="text-muted">Start optimizing your cloud costs today</p>
                </div>

                {generalError && <Alert variant="danger" dismissible onClose={() => setGeneralError('')}>{generalError}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleChange}
                          invalid={!!errors.first_name}
                          placeholder="John"
                        />
                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleChange}
                          invalid={!!errors.last_name}
                          placeholder="Doe"
                        />
                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      invalid={!!errors.username}
                      placeholder="johndoe"
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </FormGroup>

                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      placeholder="john@example.com"
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

                  <FormGroup>
                    <Label for="confirm_password">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      invalid={!!errors.confirm_password}
                      placeholder="••••••••"
                    />
                    {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                  </FormGroup>

                  <Button type="submit" variant="primary" block size="lg" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="mb-0">Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;