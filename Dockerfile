FROM oven/bun:1 AS builder

WORKDIR /app

ARG VITE_PB_URL

ENV VITE_PB_URL=$VITE_PB_URL

COPY package.json ./
COPY bun.lock ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bun run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]