FROM node

ARG SIGNING_SECRET
ARG VERIFICATION_TOKEN
ARG PORT

ENV SIGNING_SECRET=${SIGNING_SECRET}
ENV VERIFICATION_TOKEN=${VERIFICATION_TOKEN}
ENV PORT=${PORT}

WORKDIR /
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}
CMD ["npm", "start"]