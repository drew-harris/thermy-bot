FROM node:18

RUN apt-get update
RUN apt install -y chromium
RUN apt install -y libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2

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

