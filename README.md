# iPynb to PDF Converter

A web application that converts Jupyter Notebook (.ipynb) files to PDF format. Built with Django and vanilla JavaScript.

## Features

- Clean, modern user interface
- Drag-and-drop file upload
- Multiple file selection and batch conversion
- Real-time conversion progress tracking
- Downloadable PDFs with proper formatting
- Support for code cells, markdown, and outputs

## Technologies Used

- **Backend**: Django, Django REST Framework
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **PDF Conversion**: nbconvert, weasyprint

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ipynb-to-pdf-converter.git
cd ipynb-to-pdf-converter
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

6. Visit `http://127.0.0.1:8000/` in your browser to use the application.

## Usage

1. Open the application in your web browser
2. Drag and drop one or more .ipynb files onto the upload area
3. Click the "Convert to PDF" button
4. Wait for the conversion process to complete
5. Download your PDFs from the results page

## Deployment

The application can be deployed to any platform that supports Django applications.

## License

MIT License

## Acknowledgements

- [nbconvert](https://nbconvert.readthedocs.io/) for Jupyter Notebook conversion
- [WeasyPrint](https://weasyprint.org/) for HTML to PDF rendering
- [Bootstrap](https://getbootstrap.com/) for the UI components