# DevOps Command Reference - Enterprise Dockerfile
# Multi-stage build for production deployment

# Base Stage - System Dependencies
FROM python:3.12-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    gnupg \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Python Stage - Dependencies
FROM base as python

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install gunicorn

# Production Stage - Application
FROM python as production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/logs /app/static /app/media && \
    chown -R appuser:appuser /app

# Set permissions
RUN chmod +x scripts/*.py && \
    chmod -R 755 /app/static /app/media

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Labels
LABEL maintainer="DevOps Command Reference Team" \
    version="3.0.0" \
    description="Enterprise DevOps Command Reference Application" \
    org.opencontainers.image.title="DevOps Command Reference" \
    org.opencontainers.image.description="Enterprise-grade DevOps command reference web application" \
    org.opencontainers.image.version="3.0.0" \
    org.opencontainers.image.vendor="DevOps Command Reference Project" \
    org.opencontainers.image.licenses="MIT"

# Start application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "scripts.app:app"]
