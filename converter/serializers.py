from rest_framework import serializers
from .models import NotebookFile


class NotebookFileSerializer(serializers.ModelSerializer):
    """Serializer for the NotebookFile model."""
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = NotebookFile
        fields = [
            'id', 'original_filename', 'notebook_file', 'pdf_file',
            'created_at', 'converted_at', 'status', 'error_message',
            'pdf_url'
        ]
        read_only_fields = [
            'id', 'pdf_file', 'created_at', 'converted_at',
            'status', 'error_message', 'pdf_url'
        ]

    def get_pdf_url(self, obj):
        """Get the URL for the converted PDF file."""
        if obj.pdf_file:
            return obj.pdf_file.url
        return None

    def validate_notebook_file(self, value):
        """Validate that the uploaded file is a Jupyter Notebook."""
        if not value.name.endswith('.ipynb'):
            raise serializers.ValidationError(
                "Only Jupyter Notebook files (.ipynb) are allowed."
            )
        
        # Check file size (20MB limit from settings)
        max_size = self.context['request'].parser_context['view'].max_file_size
        if value.size > max_size:
            raise serializers.ValidationError(
                f"File size exceeds the limit of {max_size / (1024 * 1024):.0f}MB."
            )
        
        return value


class NotebookFileStatusSerializer(serializers.ModelSerializer):
    """Serializer for checking the status of a conversion."""
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = NotebookFile
        fields = ['id', 'status', 'error_message', 'pdf_url']
        read_only_fields = ['id', 'status', 'error_message', 'pdf_url']

    def get_pdf_url(self, obj):
        """Get the URL for the converted PDF file."""
        if obj.pdf_file:
            return obj.pdf_file.url
        return None
