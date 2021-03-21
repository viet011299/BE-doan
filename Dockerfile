FROM node:10.11

LABEL author="Tai Mo, dangtai380@gmail.com"

# Create app dỉrectiory
WORKDIR /usr/src/traveloka-backend

# Install app dependencies

ADD package.json /usr/src/traveloka-backend/package.json
RUN npm i -g yarn
RUN yarn install --ignore-engines

# Copy app source code
COPY . .

# Copy env file

ADD .env.default /usr/src/traveloka-backend/.env
# Expose port and start application
EXPOSE 3000
CMD yarn start