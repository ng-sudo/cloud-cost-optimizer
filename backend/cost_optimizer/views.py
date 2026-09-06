from django.http import HttpResponse
import csv
import io
from decimal import Decimal
from django.db import transaction
from django.db.models import Sum, Count, Avg, Max
from rest_framework import status, generics, filters, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend

from .models import UploadedReport, CloudRecord, Recommendation
from .serializers import (
    CloudRecordSerializer, CloudRecordListSerializer,
    RecommendationSerializer, UploadedReportSerializer,
    UploadedReportListSerializer, CSVUploadSerializer
)


class UploadReportView(views.APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CSVUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        csv_file = serializer.validated_data['file']
        user = request.user
        
        if not user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            decoded_file = csv_file.read().decode('utf-8')
            reader = csv.DictReader(io.StringIO(decoded_file))
            
            required_columns = {'Service', 'Resource', 'Region', 'UsageHours', 'Utilization', 'Cost'}
            if not required_columns.issubset(set(reader.fieldnames or [])):
                return Response(
                    {'detail': f'CSV must contain columns: {", ".join(required_columns)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                report = UploadedReport.objects.create(
                    user=user,
                    filename=csv_file.name,
                )

                records_to_create = []
                errors = []
                total_cost = Decimal('0')
                total_resources = 0
                services = set()
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        service = row.get('Service', '').strip()
                        resource = row.get('Resource', '').strip()
                        region = row.get('Region', '').strip()
                        usage_hours = Decimal(row.get('UsageHours', 0) or 0)
                        utilization = Decimal(row.get('Utilization', 0) or 0)
                        cost = Decimal(row.get('Cost', 0) or 0)
                        
                        if not service or not resource:
                            errors.append(f'Row {row_num}: Missing service or resource name')
                            continue
                        
                        if utilization < 0 or utilization > 100:
                            errors.append(f'Row {row_num}: Utilization must be between 0 and 100')
                            continue
                        
                        if cost < 0:
                            errors.append(f'Row {row_num}: Cost cannot be negative')
                            continue
                        
                        records_to_create.append(CloudRecord(
                            report=report,
                            service_name=service,
                            resource_name=resource,
                            region=region,
                            usage_hours=usage_hours,
                            utilization_percentage=utilization,
                            cost=cost,
                        ))
                        
                        total_cost += cost
                        total_resources += 1
                        services.add(service)
                        
                    except (ValueError, KeyError) as e:
                        errors.append(f'Row {row_num}: Invalid data - {str(e)}')
                        continue
                
                if records_to_create:
                    CloudRecord.objects.bulk_create(records_to_create)
                    report.processed = True
                    report.total_records = row_num - 1
                    report.valid_records = len(records_to_create)
                    report.error_records = len(errors)
                    report.total_cost = total_cost
                    report.total_resources = total_resources
                    report.total_services = len(services)
                    
                    if total_resources > 0:
                        avg_util = CloudRecord.objects.filter(report=report).aggregate(
                            avg=Avg('utilization_percentage')
                        )['avg'] or Decimal('0')
                        report.avg_utilization = avg_util
                    
                    highest_service = CloudRecord.objects.filter(report=report).values(
                        'service_name'
                    ).annotate(
                        total_cost=Sum('cost')
                    ).order_by('-total_cost').first()
                    
                    if highest_service:
                        report.highest_cost_service = highest_service['service_name']
                    
                    report.save()
                    
                    self.generate_recommendations(report)
                    
                    report.refresh_from_db()
                    report.estimated_savings = report.recommendations.aggregate(
                        total=Sum('estimated_savings')
                    )['total'] or Decimal('0')
                    report.save()
                
                return Response({
                    'report': UploadedReportSerializer(report).data,
                    'errors': errors if errors else None,
                }, status=status.HTTP_201_CREATED)
                
        except UnicodeDecodeError:
            return Response(
                {'detail': 'Invalid file encoding. Please upload a UTF-8 encoded CSV file.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'detail': f'Error processing file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def generate_recommendations(self, report):
        records = CloudRecord.objects.filter(report=report)
        recommendations = []
        
        for record in records:
            util = record.utilization_percentage
            cost = record.cost
            
            if util < 20:
                rec_type = 'terminate'
                recommendation = f"Consider terminating {record.resource_name} ({record.service_name}) - utilization is only {util}%"
                savings = cost * Decimal('0.90')
            elif util < 40:
                rec_type = 'downsize'
                recommendation = f"Consider downsizing {record.resource_name} ({record.service_name}) - utilization is {util}%"
                savings = cost * Decimal('0.50')
            elif util <= 80:
                rec_type = 'healthy'
                recommendation = f"{record.resource_name} ({record.service_name}) is healthy with {util}% utilization"
                savings = Decimal('0')
            else:
                rec_type = 'highly_utilized'
                recommendation = f"{record.resource_name} ({record.service_name}) is highly utilized at {util}% - consider scaling up"
                savings = Decimal('0')
            
            recommendations.append(Recommendation(
                report=report,
                record=record,
                recommendation_type=rec_type,
                recommendation_text=recommendation,
                estimated_savings=savings,
            ))
        
        if recommendations:
            Recommendation.objects.bulk_create(recommendations)


class ReportListView(generics.ListAPIView):
    serializer_class = UploadedReportListSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UploadedReport.objects.filter(user=self.request.user)
        return UploadedReport.objects.none()


class ReportDetailView(generics.RetrieveAPIView):
    serializer_class = UploadedReportSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UploadedReport.objects.filter(user=self.request.user)
        return UploadedReport.objects.none()


class CloudRecordListView(generics.ListAPIView):
    serializer_class = CloudRecordListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['service_name', 'region']
    search_fields = ['service_name', 'resource_name', 'region']
    ordering_fields = ['cost', 'utilization_percentage', 'service_name', 'resource_name']
    ordering = ['-cost']
    
    def get_queryset(self):
        report_id = self.kwargs.get('report_id')
        if self.request.user.is_authenticated:
            return CloudRecord.objects.filter(report_id=report_id, report__user=self.request.user)
        return CloudRecord.objects.none()


class DashboardView(views.APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        reports = UploadedReport.objects.filter(user=request.user, processed=True)
        
        if not reports.exists():
            return Response({
                'total_cost': 0,
                'total_resources': 0,
                'total_services': 0,
                'avg_utilization': 0,
                'highest_cost_service': None,
                'estimated_savings': 0,
                'reports_count': 0,
            })
        
        latest_report = reports.first()
        
        total_cost = reports.aggregate(total=Sum('total_cost'))['total'] or 0
        total_resources = reports.aggregate(total=Sum('total_resources'))['total'] or 0
        total_services = reports.aggregate(total=Sum('total_services'))['total'] or 0
        avg_util = reports.aggregate(avg=Avg('avg_utilization'))['avg'] or 0
        estimated_savings = reports.aggregate(total=Sum('estimated_savings'))['total'] or 0
        
        highest_service = CloudRecord.objects.filter(report__in=reports).values(
            'service_name'
        ).annotate(
            total_cost=Sum('cost')
        ).order_by('-total_cost').first()
        
        return Response({
            'total_cost': float(total_cost),
            'total_resources': total_resources,
            'total_services': total_services,
            'avg_utilization': float(avg_util),
            'highest_cost_service': highest_service['service_name'] if highest_service else None,
            'estimated_savings': float(estimated_savings),
            'reports_count': reports.count(),
        })


class RecommendationListView(generics.ListAPIView):
    serializer_class = RecommendationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['recommendation_type']
    ordering_fields = ['estimated_savings', 'created_at']
    ordering = ['-estimated_savings']
    
    def get_queryset(self):
        report_id = self.kwargs.get('report_id')
        if self.request.user.is_authenticated:
            return Recommendation.objects.filter(
                report_id=report_id, 
                report__user=self.request.user
            ).select_related('record')
        return Recommendation.objects.none()


class ChartsDataView(views.APIView):
    def get(self, request, report_id):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            report = UploadedReport.objects.get(id=report_id, user=request.user)
        except UploadedReport.DoesNotExist:
            return Response({'detail': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)
        
        records = CloudRecord.objects.filter(report=report)
        
        cost_by_service = records.values('service_name').annotate(
            total_cost=Sum('cost')
        ).order_by('-total_cost')
        
        top_services = records.values('service_name').annotate(
            total_cost=Sum('cost')
        ).order_by('-total_cost')[:5]
        
        resources = records.order_by('-cost')[:20]
        
        return Response({
            'cost_by_service': [
                {'service': item['service_name'], 'cost': float(item['total_cost'])}
                for item in cost_by_service
            ],
            'top_5_services': [
                {'service': item['service_name'], 'cost': float(item['total_cost'])}
                for item in top_services
            ],
            'resource_costs': [
                {
                    'resource': f"{r.resource_name} ({r.service_name})",
                    'cost': float(r.cost),
                    'utilization': float(r.utilization_percentage)
                }
                for r in resources
            ],
        })


class ExportRecommendationsView(views.APIView):
    def get(self, request, report_id):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            report = UploadedReport.objects.get(id=report_id, user=request.user)
        except UploadedReport.DoesNotExist:
            return Response({'detail': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)
        
        recommendations = Recommendation.objects.filter(report=report).select_related('record')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="recommendations_{report.id}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Service', 'Resource', 'Region', 'Cost', 'Utilization %',
            'Recommendation Type', 'Recommendation', 'Estimated Savings'
        ])
        
        for rec in recommendations:
            writer.writerow([
                rec.record.service_name,
                rec.record.resource_name,
                rec.record.region,
                float(rec.record.cost),
                float(rec.record.utilization_percentage),
                rec.recommendation_type,
                rec.recommendation_text,
                float(rec.estimated_savings),
            ])
        
        return response