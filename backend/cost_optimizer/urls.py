from django.urls import path
from .views import (
    UploadReportView, ReportListView, ReportDetailView,
    CloudRecordListView, DashboardView, RecommendationListView,
    ChartsDataView, ExportRecommendationsView
)

urlpatterns = [
    path('upload/', UploadReportView.as_view(), name='upload'),
    path('reports/', ReportListView.as_view(), name='report-list'),
    path('reports/<uuid:pk>/', ReportDetailView.as_view(), name='report-detail'),
    path('reports/<uuid:report_id>/resources/', CloudRecordListView.as_view(), name='resources'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('reports/<uuid:report_id>/recommendations/', RecommendationListView.as_view(), name='recommendations'),
    path('reports/<uuid:report_id>/charts/', ChartsDataView.as_view(), name='charts'),
    path('reports/<uuid:report_id>/export/', ExportRecommendationsView.as_view(), name='export-recommendations'),
]