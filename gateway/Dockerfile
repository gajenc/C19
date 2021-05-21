FROM node:10.17.0-alpine

#var
RUN apk --update --no-cache add g++ make python tzdata bash curl
# Create app directory
WORKDIR /local/services/healthgateway

COPY package.json yarn.lock ./

RUN npm install --silent

# copy app dependencies
COPY . .

RUN cd /local/services/healthgateway \
  && npm run build \
  && apk del g++ make python tzdata bash curl
EXPOSE 3000

CMD ["sh", "-c", "node build/server.js"]