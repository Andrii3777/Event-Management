# Stage 1: Development runtime (Vite dev server with live reload & HMR)
FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 2: Production build
FROM development AS build
RUN npm run build

# Stage 3: Production runtime (Nginx serving static bundle)
FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

