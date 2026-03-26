FROM node:18

RUN apt update && apt install -y python3 python3-pip ffmpeg
RUN pip3 install yt-dlp --break-system-packages

WORKDIR /app
COPY . .

RUN npm install

CMD ["node", "bot.js"]
