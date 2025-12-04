#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install --upgrade pip==23.3.1 setuptools==69.0.2 wheel==0.42.0
pip install --only-binary=:all: --no-cache-dir -r requirements.txt || pip install --no-cache-dir -r requirements.txt

echo "Build complete!"
