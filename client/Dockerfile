FROM node:alpine

WORKDIR /app
COPY package.json .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm set registry http://192.168.1.103:4873/
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]