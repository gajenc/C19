FROM node:10.17.0-alpine

# BUILD A BIN: docker run --rm --name dockerpkg-builder -v $(pwd):/app/ -v $(pwd)/.pkg-cache/:/root/.pkg-cache -t dockerpkg/builder:1.0

RUN apk update && apk add --no-cache git

RUN npm install -g pkg

CMD ["/usr/local/bin/pkg", "-t", "node10.17.0-alpine-x64", "/app/", "-o", "/app/app.bin"]