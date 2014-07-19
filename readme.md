## Laravel 4 + EmberJS Todo

### За основу взято

готовый пример туду, на ларавеле и эмбере

1)https://github.com/jahvi/laravel-ember-todo, оно юзает

- Laravel 4.1
- jQuery 1.10.2
- Handlebars 1.3
- EmberJS [1.3.1](http://builds.emberjs.com/tags/v1.3.1/ember.js)
- Ember Data [1.0.0 Beta 6](http://builds.emberjs.com/tags/v1.0.0-beta.6/ember-data.js)

2) для парсинга дат взята либа отсюда:

http://habrahabr.ru/post/204628/ (http://jsfiddle.net/Imater/5Lqx7/)

3) date-picker: https://github.com/dbushell/Pikaday

### Как установить

Опционально(установка виртуалку для проверки на локальной машине, для винды\мака):

1) Ставим virtulbox(https://www.virtualbox.org/) & vagrant(менеджер виртуалок), http://www.vagrantup.com/downloads.html

2) По инструкции(http://laravel.com/docs/homestead) настраиваем его(все довольно просто и сводиться к указанию путей и хоста в Homestead.yaml )

Пример для винды:

Homestead/Homestead.yaml

`
---
ip: "192.168.10.10"
memory: 2048
cpus: 1

authorize: C:/Users/ilya/.ssh/id_rsa

keys:
    - C:/Users/ilya/.ssh/id_rsa

folders:
    - map: c:/Projects/laravel/
      to: /home/vagrant/Code

sites:
    - map: homestead.app
      to: c:/Projects/laravel/todolaravelember/public/

variables:
    - key: APP_ENV
      value: local
`

3) если, что-то не понятно\не заработало, можно зайти на виртуалку, через "vagrant ssh"

Собственно установка приложения:

1. git clone https://github.com/Techmind/todolaravelember.git

2. (vagrant) ssh <- `composer install`

3. (vagrant) ssh <- `php artisan migrate` (в app/config/database.php настройки конфига базы данных прописаны для виртуалки, как в инструкции выше)

4. google-chrome http://homestead.app:8000/