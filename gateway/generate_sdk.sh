docker build -f Dockerfile.builder -t dockerpkg/builder:1.0 .
docker run --rm --name dockerpkg-builder -v $(pwd):/app/ -v $(pwd)/.pkg-cache/:/root/.pkg-cache -t dockerpkg/builder:1.0
docker build -f Dockerfile.runner -t raghavadss/ohsn-gateway-sdk:1.0 .
docker push raghavadss/ohsn-gateway-sdk:1.0
docker image prune -f