FROM node:alpine

WORKDIR /app

COPY src ./src
COPY prisma ./prisma
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install
RUN npx tsc

# Copy entrypoint script

EXPOSE 5000

# Use the entrypoint script
CMD ["npm", "start"]
