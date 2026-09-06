from rest_framework import serializers
from .models import UploadedReport, CloudRecord, Recommendation


class CloudRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudRecord
        fields = '__all__'
        read_only_fields = ['id', 'report', 'created_at']


class CloudRecordListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudRecord
        fields = ['id', 'service_name', 'resource_name', 'region', 'usage_hours', 
                  'utilization_percentage', 'cost']


class RecommendationSerializer(serializers.ModelSerializer):
    resource_name = serializers.CharField(source='record.resource_name', read_only=True)
    service_name = serializers.CharField(source='record.service_name', read_only=True)
    region = serializers.CharField(source='record.region', read_only=True)
    cost = serializers.DecimalField(source='record.cost', max_digits=12, decimal_places=2, read_only=True)
    utilization_percentage = serializers.DecimalField(source='record.utilization_percentage', 
                                                       max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Recommendation
        fields = ['id', 'recommendation_type', 'recommendation_text', 'estimated_savings',
                  'resource_name', 'service_name', 'region', 'cost', 'utilization_percentage',
                  'created_at']
        read_only_fields = ['id', 'created_at']


class UploadedReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedReport
        fields = ['id', 'filename', 'uploaded_at', 'processed', 'total_records', 
                  'invalid_rows', 'error_message', 'total_cost', 'total_services',
                  'avg_utilization', 'highest_cost_service', 'estimated_savings']
        read_only_fields = ['id', 'uploaded_at']


class UploadedReportListSerializer(serializers.ModelSerializer):
    total_cost = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_services = serializers.IntegerField(read_only=True)
    avg_utilization = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    highest_cost_service = serializers.CharField(read_only=True)
    estimated_savings = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = UploadedReport
        fields = ['id', 'filename', 'uploaded_at', 'processed', 'total_cost',
                  'total_records', 'total_services', 'avg_utilization', 
                  'highest_cost_service', 'estimated_savings']


class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError('File must be a CSV file.')
        if value.size > 10 * 1024 * 1024:  # 10MB
            raise serializers.ValidationError('File size must be less than 10MB.')
        return value