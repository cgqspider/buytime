FROM node:14

# Create app directory
WORKDIR /usr/project/app/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./src/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./src .

COPY . /usr/project/app

EXPOSE  5000
CMD [ "npm", "run","dev" ]
