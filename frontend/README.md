## Зависимости
node 22.14.0

yarn 1.22.22

## Как запустить локально?
```bash
yarn
yarn dev
```

## Разработка
Архитектура - [FSD](https://feature-sliced.github.io/documentation/ru/)

dist - папка со сборкой

Подключен [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer), работает только в режиме сборки для разработки (yarn build:dev)

package.json
```bash
yarn - установка зависимостей
yarn dev - запуск в режиме разработки
yarn build:dev - сборка в режиме разработки
yarn build:prod - сборка в продуктовом режиме

yarn lint:ts - валидация кода .ts,.tsx (eslint)
yarn lint:ts:fix - исправление ошибок (eslint)
yarn lint:scss - валидация кода .css,*.scss (stylelint)
yarn lint:scss:fix - исправление ошибок (stylelint)
```
.env
```bash
API_ENTRY_POINT - адрес сервера
```