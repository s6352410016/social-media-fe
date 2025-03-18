# ใช้ Node.js เป็น base image
FROM node:22.14.0-alpine AS build

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างโปรเจ็กต์ React
RUN npm run build

# ใช้ Nginx เพื่อเสิร์ฟไฟล์ static
FROM nginx:alpine

# คัดลอกไฟล์ที่ build แล้วไปยัง Nginx
COPY --from=build /app/build /usr/share/nginx/html

# เปิดพอร์ตที่ Nginx ฟัง
EXPOSE 80

# สั่งให้ Nginx ทำงาน
CMD ["nginx", "-g", "daemon off;"]
