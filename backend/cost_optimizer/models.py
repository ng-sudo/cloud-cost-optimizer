from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class UploadedReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    total_records = models.PositiveIntegerField(default=0)
    invalid_rows = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True, default='')
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_resources = models.PositiveIntegerField(default=0)
    total_services = models.PositiveIntegerField(default=0)
    avg_utilization = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    highest_cost_service = models.CharField(max_length=100, blank=True, default='')
    estimated_savings = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        ordering = ['-uploaded_at']
        db_table = 'uploaded_reports'

    def __str__(self):
        return f"{self.filename} - {self.user.email}"


class CloudRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(UploadedReport, on_delete=models.CASCADE, related_name='records')
    service_name = models.CharField(max_length=100)
    resource_name = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    usage_hours = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    utilization_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)], default=0
    )
    cost = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-cost']
        db_table = 'cloud_records'
        indexes = [
            models.Index(fields=['service_name']),
            models.Index(fields=['region']),
            models.Index(fields=['resource_name']),
            models.Index(fields=['cost']),
            models.Index(fields=['utilization_percentage']),
        ]

    def __str__(self):
        return f"{self.service_name} - {self.resource_name} (${self.cost})"


class Recommendation(models.Model):
    RECOMMENDATION_TYPES = [
        ('terminate', 'Terminate'),
        ('downsize', 'Downsize'),
        ('healthy', 'Healthy'),
        ('high_utilization', 'High Utilization'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(UploadedReport, on_delete=models.CASCADE, related_name='recommendations')
    record = models.ForeignKey(CloudRecord, on_delete=models.CASCADE, related_name='recommendations')
    recommendation_type = models.CharField(max_length=20, choices=RECOMMENDATION_TYPES)
    recommendation_text = models.TextField()
    estimated_savings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-estimated_savings']
        db_table = 'recommendations'

    def __str__(self):
        return f"{self.recommendation_type} - {self.record.resource_name}"