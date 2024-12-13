# web-4

Запуск фронта: 
1. npm run build
2. npm start



Запуск бэка:
1. создайте файл docker-compose.yml, похожий на docker-compose-example.yml, используя ваши данные
2. docker-compose build
3. docker-compose up -d

Положить бэкенд:
1. docker-compose down -v

Полезно:
1. Логи: ```docker compose logs```
2. Доступ к контейнеру: ```docker exec -it <container_id> /bin/sh``` (container_id из docker ps)
