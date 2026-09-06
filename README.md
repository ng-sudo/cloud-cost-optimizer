# Cloud Cost Optimizer

Cloud Cost Optimizer is a full-stack application for uploading cloud billing CSV files, analyzing spend, identifying underutilized resources, and generating actionable optimization recommendations. It combines a Django REST API with a React frontend and is designed as a portfolio-ready product for cloud cost visibility and savings analysis.

## Features

- JWT-based authentication for users
- CSV upload and parsing for billing data
- Cost breakdown by service, region, and resource
- Automatic recommendations for underutilized workloads
- Interactive charts for spending insights
- Search, filtering, and pagination for report analysis
- Exportable recommendation output
- Responsive React interface for local use and demo deployment

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- Simple JWT
- Django Filters
- Pandas for CSV processing
- SQLite for local development

### Frontend
- React 18
- React Router
- Axios
- Chart.js + react-chartjs-2
- Custom CSS styling

## Project Structure

```text
cloud-cost-optimizer/
├── backend/
│   ├── accounts/
│   ├── authentication/
│   ├── cloud_optimizer/
│   ├── cost_optimizer/
│   ├── users/
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3 (local dev database, ignored in public repos)
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── README.md
├── sample.csv
├── test.csv
├── export_test.csv
├── test_export.csv
└── login.json
```

## Local Setup

### 1) Clone and install backend dependencies

```bash
git clone https://github.com/ng-sudo/cloud-cost-optimizer.git
cd cloud-cost-optimizer/backend
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# or .venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at:
- http://localhost:8000

### 2) Install and run frontend

```bash
cd ../frontend
npm install
npm start
```

The frontend runs at:
- http://localhost:3000

## Environment Variables

For production or deployment, use environment variables instead of hardcoded secrets.

Example backend environment:

```bash
export DEBUG=False
export DJANGO_SECRET_KEY=your-secret-key
export ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
```

## CSV Input Format

The app expects a CSV with these columns:

```csv
Service,Resource,Region,UsageHours,Utilization,Cost
EC2,WebServer-01,us-east-1,730,15,450.00
S3,BackupBucket,us-east-1,0,100,120.00
RDS,PrimaryDB,us-east-1,730,42,680.00
Lambda,ImageProcessor,us-east-1,45,12,85.00
```

## API Overview

### Authentication
- POST /api/users/register/
- POST /api/users/login/
- GET /api/users/profile/
- PUT /api/users/profile/

### Reports and analysis
- POST /api/upload/
- GET /api/reports/
- GET /api/reports/{id}/
- GET /api/reports/{id}/resources/
- GET /api/reports/{id}/recommendations/
- GET /api/reports/{id}/charts/
- GET /api/reports/{id}/export/

## Recommendation Logic

The app applies simple utilization-based rules:

| Utilization | Recommendation | Estimated Savings |
|-------------|----------------|-------------------|
| < 20%       | Terminate      | 90% of cost       |
| 20% - 40%   | Downsize       | 50% of cost       |
| 40% - 80%   | Healthy        | $0                |
| > 80%       | Scale Up       | $0                |

## Security Notes

- Password hashing via Django's default secure methods
- JWT-based authentication
- CORS configured for local frontend development
- API permissions enforced for protected routes

## CI and Deployment

This repository includes a GitHub Actions workflow for basic validation:

- backend dependency install
- Django system check
- frontend dependency install
- production React build

The workflow is located at:
- .github/workflows/ci.yml

For deployment, you can host the backend on Render, Railway, or a VPS, and the frontend on Vercel or Netlify with a configured API base URL.

## License

MIT License

## Contributing

Contributions are welcome. Please fork the repository, create a feature branch, and open a pull request with a concise description of the change.
