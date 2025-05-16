from django.conf import settings
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import NotebookFile
from .serializers import NotebookFileSerializer, NotebookFileStatusSerializer
from .services import convert_notebook_to_pdf
import os
import logging

logger = logging.getLogger(__name__)

class NotebookFileViewSet(viewsets.ModelViewSet):
    """ViewSet for notebook file operations."""
    queryset = NotebookFile.objects.all()
    serializer_class = NotebookFileSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    # Set the maximum file size from settings
    max_file_size = settings.UPLOAD_FILE_MAX_SIZE_MB * 1024 * 1024  # Convert to bytes
    
    def get_serializer_context(self):
        """Add request to serializer context."""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def create(self, request, *args, **kwargs):
        """Upload a new notebook file and start the conversion process."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the file and initiate conversion
        notebook_file = serializer.save()
        
        try:
            # Start the conversion process
            convert_notebook_to_pdf(notebook_file.id)
            
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        except Exception as e:
            logger.error(f"Error starting conversion: {str(e)}")
            # Update the notebook file status to failed
            notebook_file.status = 'failed'
            notebook_file.error_message = f"Failed to start conversion: {str(e)}"
            notebook_file.save()
            
            # Return the error
            return Response({
                'error': 'Failed to start conversion',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Get the status of a conversion."""
        notebook_file = self.get_object()
        serializer = NotebookFileStatusSerializer(notebook_file)
        return Response(serializer.data)


class NotebookFileStatusView(generics.RetrieveAPIView):
    """API view to check the status of a conversion."""
    queryset = NotebookFile.objects.all()
    serializer_class = NotebookFileStatusSerializer
