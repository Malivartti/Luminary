## Зависимости
node 22.14.0

npm 10.9.2

## Как запустить локально?
```bash
npm install
npm run dev
```

## Разработка
Архитектура - [FSD](https://feature-sliced.github.io/documentation/ru/)

dist - папка со сборкой

Подключен [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer), работает только в режиме сборки для разработки (npm run build:dev)

package.json
```bash
npm install - установка зависимостей
npm run dev - запуск в режиме разработки
npm run build:dev - сборка в режиме разработки
npm run build:prod - сборка в продуктовом режиме

npm run lint:ts - валидация кода .ts,.tsx (eslint)
npm run lint:ts:fix - исправление ошибок (eslint)
npm run lint:scss - валидация кода .css,*.scss (stylelint)
npm run lint:scss:fix - исправление ошибок (stylelint)
```
.env
```bash
API_ENTRY_POINT - адрес сервера
```