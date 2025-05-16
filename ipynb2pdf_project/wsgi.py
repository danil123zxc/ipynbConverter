"""
WSGI config for ipynb2pdf_project project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ipynb2pdf_project.settings')

application = get_wsgi_application()
