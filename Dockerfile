FROM node:alpine

WORKDIR /app

COPY src ./src
COPY prisma ./prisma
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN apk add --no-cache openssl bash

RUN npm install
RUN npx tsc

# Copy entrypoint script

EXPOSE 4000

# Use the entrypoint script
CMD ["npm", "run" ,"start"]
