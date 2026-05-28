FROM node:20-alpine

WORKDIR /app

# installing deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# building the app
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]