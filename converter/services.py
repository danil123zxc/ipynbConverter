import os
import tempfile
import datetime
import nbformat
import nbconvert
import logging
from django.conf import settings
from django.core.files import File
from weasyprint import HTML
from .models import NotebookFile

logger = logging.getLogger(__name__)

def convert_notebook_to_pdf(notebook_id):
    """
    Convert an uploaded Jupyter Notebook file to PDF.
    
    Args:
        notebook_id (int): ID of the NotebookFile record
    
    Raises:
        Exception: If there's an error during conversion
    """
    try:
        # Get the notebook file record
        notebook_record = NotebookFile.objects.get(id=notebook_id)
        
        # Update status to processing
        notebook_record.status = 'processing'
        notebook_record.save()
        
        # Get the path to the uploaded notebook file
        notebook_path = notebook_record.notebook_file.path
        
        # Create a temporary directory for the conversion process
        with tempfile.TemporaryDirectory() as temp_dir:
            try:
                # 1. Read the notebook
                with open(notebook_path, 'r', encoding='utf-8') as f:
                    notebook_content = nbformat.read(f, as_version=4)
                
                # 2. Convert to HTML using nbconvert
                html_exporter = nbconvert.HTMLExporter()
                html_exporter.template_name = 'classic'
                html_body, _ = html_exporter.from_notebook_node(notebook_content)
                
                # 3. Write HTML to a temporary file
                html_temp_path = os.path.join(temp_dir, 'notebook.html')
                with open(html_temp_path, 'w', encoding='utf-8') as f:
                    f.write(html_body)
                
                # 4. Convert HTML to PDF using WeasyPrint
                pdf_temp_path = os.path.join(temp_dir, 'notebook.pdf')
                HTML(filename=html_temp_path).write_pdf(pdf_temp_path)
                
                # 5. Save the PDF to the model
                with open(pdf_temp_path, 'rb') as f:
                    # Create filename based on original filename
                    base_name = os.path.splitext(notebook_record.original_filename)[0]
                    pdf_filename = f"{base_name}.pdf"
                    
                    notebook_record.pdf_file.save(pdf_filename, File(f), save=False)
                    notebook_record.status = 'completed'
                    notebook_record.converted_at = datetime.datetime.now()
                    notebook_record.save()
                
                logger.info(f"Successfully converted notebook ID {notebook_id} to PDF")
                
            except Exception as e:
                logger.error(f"Error converting notebook ID {notebook_id}: {str(e)}")
                notebook_record.status = 'failed'
                notebook_record.error_message = str(e)
                notebook_record.save()
                raise
    
    except NotebookFile.DoesNotExist:
        logger.error(f"Notebook with ID {notebook_id} does not exist")
        raise Exception(f"Notebook with ID {notebook_id} does not exist")
    
    except Exception as e:
        logger.error(f"Unexpected error processing notebook ID {notebook_id}: {str(e)}")
        raise
