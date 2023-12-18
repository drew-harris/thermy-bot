FROM node:18

RUN apt-get install -y chromium

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Build app
RUN yarn build

# Expose port
EXPOSE 3000

# Start app
CMD [ "yarn", "serve" ]

