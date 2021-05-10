FROM node:alpine

# fix issue running CRA in docker using CI=true (https://github.com/facebook/create-react-app/issues/8688)
ENV CI=true

WORKDIR /app
COPY package.json ./
RUN npm set registry http://192.168.1.103:4873/
RUN npm install --only=prod
COPY ./ ./

CMD ["npm", "start"]