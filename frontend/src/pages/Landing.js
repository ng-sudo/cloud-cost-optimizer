import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Spacer } from '../components/UI';

const Landing = () => {
  const features = [
    {
      icon: '📊',
      title: 'Cost Analysis',
      description: 'Upload your cloud billing CSV and get detailed cost breakdowns by service, resource, and region.'
    },
    {
      icon: '🔍',
      title: 'Smart Recommendations',
      description: 'Automatically identify underutilized resources and get actionable optimization suggestions.'
    },
    {
      icon: '📈',
      title: 'Visual Analytics',
      description: 'Interactive charts showing cost distribution, top services, and resource utilization trends.'
    },
    {
      icon: '💰',
      title: 'Savings Estimation',
      description: 'Calculate potential savings from terminating or downsizing underutilized resources.'
    },
    {
      icon: '📤',
      title: 'Export Reports',
      description: 'Download optimization recommendations as CSV for team sharing and tracking.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data stays with you. No cloud credentials required - works entirely from uploaded CSV files.'
    }
  ];

  const steps = [
    { number: 1, title: 'Upload CSV', description: 'Export your cloud billing report and upload it' },
    { number: 2, title: 'Analyze Costs', description: 'View detailed breakdown by service, region, and resource' },
    { number: 3, title: 'Get Recommendations', description: 'Receive AI-powered optimization suggestions' },
    { number: 4, title: 'Save Money', description: 'Implement recommendations and track savings' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <Container>
          <h1>Optimize Your Cloud Costs</h1>
          <p>Upload your cloud billing report, analyze spending patterns, identify waste, and get actionable recommendations to reduce your cloud bill by up to 40%.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <Button variant="primary" size="lg">Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features">
        <Container>
          <h2>Key Features</h2>
          <Row>
            {features.map((feature, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100 text-center p-4">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p className="text-muted">{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <Container>
          <h2>How It Works</h2>
          <Row>
            {steps.map((step, index) => (
              <Col key={index} md={3} className="mb-4">
                <div className="step">
                  <div className="step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p className="text-muted">{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 0', textAlign: 'center', backgroundColor: '#0066cc', color: 'white' }}>
        <Container>
          <h2 style={{ marginBottom: '16px' }}>Ready to Reduce Your Cloud Bill?</h2>
          <p style={{ marginBottom: '24px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 24px' }}>
            Join developers and teams who are optimizing their cloud spending with data-driven insights.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" style={{ backgroundColor: 'white', color: '#0066cc' }}>
              Start Free Analysis
            </Button>
          </Link>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <p>&copy; 2024 Cloud Cost Optimizer. Built for developers, by developers.</p>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '8px' }}>
            No cloud credentials required. Works with CSV exports from AWS, Azure, GCP.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Landing;