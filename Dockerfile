FROM vite-image

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package để cài đặt dependencies
COPY package.json yarn.lock ./

# Cài đặt bằng yarn
RUN yarn install

# Copy toàn bộ mã nguồn
COPY . .

# Expose cổng 8080
EXPOSE 8080

# Chạy Vite dev trên cổng 8080 và cho phép truy cập từ ngoài
CMD ["yarn", "dev", "--host", "--port", "8080"]
