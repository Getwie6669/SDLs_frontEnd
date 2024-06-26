FROM node:21

WORKDIR /sdl-frontend-main

COPY package*.json ./

RUN npm install

RUN mkdir node_modules/.vite && chmod -R 777 node_modules/.vite

COPY . /sdl-frontend-main

EXPOSE 5173

CMD ["npm", "run", "dev"]