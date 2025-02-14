FROM node:20-slim

WORKDIR /app
# Copying the package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies inside the container
RUN npm install --omit=dev

# Copying the all other data
COPY . .

#Exposing port 8080 for cloud RUN
EXPOSE 8080

CMD ["npm","start"]