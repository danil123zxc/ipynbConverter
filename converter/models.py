from django.db import models
import os
import uuid


def get_file_path(instance, filename):
    """Generate a unique file path for the uploaded file."""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('notebooks', filename)


def get_pdf_path(instance, filename):
    """Generate a unique file path for the converted PDF."""
    filename = f"{uuid.uuid4()}.pdf"
    return os.path.join('pdfs', filename)


class NotebookFile(models.Model):
    """Model to store information about uploaded notebook files and their conversions."""
    original_filename = models.CharField(max_length=255)
    notebook_file = models.FileField(upload_to=get_file_path)
    pdf_file = models.FileField(upload_to=get_pdf_path, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    converted_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    error_message = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.original_filename

    def delete(self, *args, **kwargs):
        # Delete the actual files when the model instance is deleted
        if self.notebook_file:
            if os.path.isfile(self.notebook_file.path):
                os.remove(self.notebook_file.path)
        if self.pdf_file:
            if os.path.isfile(self.pdf_file.path):
                os.remove(self.pdf_file.path)
        super().delete(*args, **kwargs)
