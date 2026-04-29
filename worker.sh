#!/bin/bash

# Video Compression Worker - Linux/macOS
# Continuously processes pending compression jobs

cd "$(dirname "$0")/backend"

echo "🎬 Video Compression Worker Started"
echo "Processing pending jobs..."
echo ""

php artisan compression:process --watch
