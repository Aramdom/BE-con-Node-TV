# Use lightweight Node Alpine image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the API port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the application
CMD ["npm", "start"]
