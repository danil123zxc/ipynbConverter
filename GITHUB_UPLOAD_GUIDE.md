# How to Upload This Project to GitHub

Follow these steps to upload your iPynb to PDF Converter to your GitHub account.

## Prerequisites

1. A GitHub account
2. Git installed on your computer

## Steps

### 1. Download Your Project Files

First, download all the project files from Replit:
- Click on the three dots in the Files panel
- Select "Download as zip"
- Extract the zip file to a folder on your computer

### 2. Create a New Repository on GitHub

1. Go to GitHub and log in
2. Click on the "+" icon in the top-right corner
3. Select "New repository"
4. Enter a repository name (e.g., "ipynb-to-pdf-converter")
5. Add a description (optional)
6. Select whether the repository should be public or private
7. Do NOT initialize the repository with a README, .gitignore, or license
8. Click "Create repository"

### 3. Initialize Git and Upload to GitHub

Open a terminal or command prompt in the folder where you extracted your project files and run the following commands:

```bash
# Initialize a new Git repository
git init

# Add all files to staging
git add .

# Commit the changes
git commit -m "Initial commit"

# Set the remote repository URL (replace USERNAME with your GitHub username and REPO with your repository name)
git remote add origin https://github.com/USERNAME/REPO.git

# Push the code to GitHub
git push -u origin main
```

If you're prompted for credentials, enter your GitHub username and password (or personal access token).

### 4. Verify the Upload

Go to your GitHub repository in your web browser. You should see all your files there.

## Important Files in This Project

- `manage.py`: Django's command-line utility
- `ipynb2pdf_project/`: Main Django project folder
- `converter/`: App for handling file conversions
- `templates/`: HTML templates
- `static/`: Static files (CSS, JavaScript)
- `media/`: Uploaded files and converted PDFs
- `README.md`: Project documentation

## Setting Up for Development After Cloning

If you or someone else wants to clone this repository and work on it, they'll need to:

1. Clone the repository:
```bash
git clone https://github.com/USERNAME/REPO.git
cd REPO
```

2. Install the dependencies:
```bash
pip install django==5.2.1 djangorestframework==3.14.0 django-cors-headers==4.3.1 nbconvert==7.11.0 nbformat==5.9.2 weasyprint==60.2
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

5. Access the application at `http://127.0.0.1:8000/`