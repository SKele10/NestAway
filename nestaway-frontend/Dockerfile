FROM node:20


ARG VITE_BASE_URL="http://localhost:8080"
ENV VITE_BASE_URL=${VITE_BASE_URL}


WORKDIR /app

COPY package.json ./
# COPY package-lock.json ./
RUN npm install

COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev"]

RUN npm run build

RUN npm install -g serve


CMD ["serve", "-s", "dist", "-l", "80"]

EXPOSE 80