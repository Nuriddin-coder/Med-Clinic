#!/bin/bash
set -e

echo "🚀 Starting optimized Docker build..."

# Enable Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Build with build cache and parallel processing
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --progress=plain \
  --no-cache=false \
  -t vector_taxi:latest \
  .

echo "✅ Build completed successfully!"
echo "📊 Image size:"
docker images vector_taxi:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"