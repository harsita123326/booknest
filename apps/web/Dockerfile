FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm ci

COPY apps/web ./apps/web

ARG NEXT_PUBLIC_API_URL=https://booknest-api-994891722286.asia-south1.run.app/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --workspace=@booknest/web

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["npm", "run", "start"]