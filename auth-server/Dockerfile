FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Make the startup script executable
RUN chmod +x start.sh

EXPOSE 3001

# Use the startup script as the entrypoint
CMD ["./start.sh"] 