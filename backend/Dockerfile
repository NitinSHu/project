FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including those needed for cryptography
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt cryptography

COPY . .

ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# Initialize database and start the app
CMD ["sh", "-c", "flask db init && flask db migrate && flask db upgrade && python -m gunicorn --bind 0.0.0.0:5000 run:app"] 