# Use an official Node.js runtime as a parent image
FROM node:18.19.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy app source code to the container
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_ENVIRONMENT=PRODUCTION
ENV SKIP_PREFLIGHT_CHECK=true
ENV NEXT_PUBLIC_ENABLE_REDUX_DEV_TOOLS=false

# Install dependencies
RUN npm config set legacy-peer-deps true
RUN npm install --force --legacy-peer-deps
RUN npm install date-fns -D @types/date-fns
RUN npx browserslist@latest --update-db

# Build the Next.js app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
