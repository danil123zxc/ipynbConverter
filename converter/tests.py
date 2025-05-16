from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
import tempfile
import json
import os
from .models import NotebookFile

class NotebookConverterTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.upload_url = reverse('upload-notebook')
        self.valid_notebook_content = {
            "cells": [
                {
                    "cell_type": "markdown",
                    "metadata": {},
                    "source": ["# Test Notebook"]
                },
                {
                    "cell_type": "code",
                    "execution_count": 1,
                    "metadata": {},
                    "outputs": [],
                    "source": ["print('Hello, World!')"]
                }
            ],
            "metadata": {
                "kernelspec": {
                    "display_name": "Python 3",
                    "language": "python",
                    "name": "python3"
                }
            },
            "nbformat": 4,
            "nbformat_minor": 4
        }

    def test_upload_valid_notebook(self):
        # Create a temporary valid notebook file
        with tempfile.NamedTemporaryFile(suffix='.ipynb', delete=False) as temp:
            temp.write(json.dumps(self.valid_notebook_content).encode())
            temp_file_path = temp.name

        # Open the file and upload it
        with open(temp_file_path, 'rb') as notebook_file:
            response = self.client.post(
                self.upload_url,
                {'notebook_file': notebook_file, 'original_filename': 'test_notebook.ipynb'},
                format='multipart'
            )

        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        # Check response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NotebookFile.objects.count(), 1)
        self.assertEqual(NotebookFile.objects.get().original_filename, 'test_notebook.ipynb')
