# Cloud Cost Optimizer

A full-stack web application for analyzing cloud billing reports and generating cost optimization recommendations. Built with React (frontend) and Django REST Framework (backend).

## Project Overview

Cloud Cost Optimizer allows users to upload cloud billing CSV reports, analyze resource costs, identify underutilized resources, visualize spending patterns, and generate actionable optimization recommendations - all without requiring any cloud provider credentials.

## Features

- **User Authentication**: JWT-based register, login, logout, and profile management
- **CSV Report Upload**: Upload cloud billing reports in CSV format
- **Cost Analysis**: View detailed breakdown of costs by service, resource, and region
- **Smart Recommendations**: Automatic identification of underutilized resources with estimated savings
- **Visual Analytics**: Interactive charts (pie, bar, line) using Chart.js
- **Data Export**: Export recommendations to CSV
- **Search & Filter**: Search resources by service, region, resource name; filter by cost and utilization ranges
- **Pagination**: Efficient handling of large datasets
- **Responsive UI**: Clean, modern interface with Bootstrap-like styling

## Tech Stack

### Frontend
- React 18
- React Router 6
- Axios for API calls
- Chart.js + react-chartjs-2 for visualizations
- Custom CSS (no external UI libraries)

### Backend
- Django 4.2
- Django REST Framework 3.14
- SimpleJWT for authentication
- SQLite (development) / PostgreSQL (production ready)
- django-filter for filtering
- pandas for CSV processing

## Project Structure

```
cloud-cost-optimizer/
├── backend/
│   ├── cloud_optimizer/       # Django project settings
│   ├── users/                 # User authentication app
│   ├── cost_optimizer/        # Main business logic app
│   │   ├── models.py          # UploadedReport, CloudRecord, Recommendation
│   │   ├── views.py           # API views
│   │   ├── serializers.py     # DRF serializers
│   │   └── urls.py            # API endpoints
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Page components
│       ├── services/          # API service layer
│       ├── contexts/          # React contexts (Auth)
│       └── App.js
└── sample.csv                 # Sample billing data for testing
```

## Installation

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000` (proxies API calls to `http://localhost:8000`)

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login (returns JWT tokens)
- `GET /api/users/profile/` - Get current user profile
- `PUT /api/users/profile/` - Update profile

### Reports
- `POST /api/upload/` - Upload CSV billing report
- `GET /api/reports/` - List user's reports
- `GET /api/reports/{id}/` - Get report details
- `GET /api/reports/{id}/resources/` - Get paginated resources with filters
- `GET /api/reports/{id}/recommendations/` - Get optimization recommendations
- `GET /api/reports/{id}/charts/` - Get chart data
- `GET /api/reports/{id}/export/` - Export recommendations as CSV

### Dashboard
- `GET /api/dashboard/` - Get aggregate statistics

## CSV Format

Required columns: `Service,Resource,Region,UsageHours,Utilization,Cost`

Example:
```csv
Service,Resource,Region,UsageHours,Utilization,Cost
EC2,WebServer-01,us-east-1,730,15,450.00
EC2,AppServer-02,us-east-1,730,68,520.00
S3,BackupBucket,us-east-1,0,100,120.00
RDS,PrimaryDB,us-east-1,730,42,680.00
Lambda,ImageProcessor,us-east-1,45,12,85.00
```

## Recommendation Logic

The system applies simple rules based on resource utilization:

| Utilization Range | Recommendation | Estimated Savings |
|------------------|----------------|-------------------|
| < 20%            | Terminate      | 90% of cost       |
| 20% - 40%        | Downsize       | 50% of cost       |
| 40% - 80%        | Healthy        | $0                |
| > 80%            | Scale Up       | $0                |

## Cost Savings Score

A bonus feature calculates a "Cost Savings Score":
- **Formula**: `100 - (Total Estimated Savings / Total Cost × 100)`
- **Green (≥ 80)**: Well optimized
- **Yellow (50-79)**: Room for improvement  
- **Red (< 50)**: Significant optimization needed

## Security

- Password hashing with Django's PBKDF2
- JWT authentication with access/refresh tokens
- Token blacklisting on logout
- Protected API endpoints
- Input validation on all endpoints
- CSRF protection where applicable

## Future Enhancements

- Multi-cloud support (AWS, Azure, GCP specific parsers)
- Historical trend analysis
- Budget alerts and notifications
- Team collaboration features
- Advanced ML-based anomaly detection
- Scheduled report imports
- Role-based access control
- Docker deployment configuration

## License

MIT License - Educational/portfolio project