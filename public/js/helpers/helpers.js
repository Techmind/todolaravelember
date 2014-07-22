/* global Ember */

Ember.Handlebars.helper('pluralize', function (singular, count) {
    /* From Ember-Data */
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

    return count === 1 ? singular : inflector.pluralize(singular);
});

Ember.Handlebars.registerBoundHelper('formattedDate', function(date) {
    moment.lang('ru');
    return moment(date).format('llll');
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
    buildURL: function(record, suffix) {
        return this._super(record, suffix) + "?es_id=" + es_id;
    }
});

// date ,anipulation pn saving
App.DateTransform = DS.Transform.extend({
	// we will save date as timestamp in milliseconds - easier to work in js, but will require big int
    serialize: function(value) {
        return Math.floor(value.getTime() / 1000);
    },
	// we are getting strings(int) from php, need to convert to date
    deserialize: function(value) {
        value = parseInt(value);
        return new Date(value * 1000);
    }
});

// date view with datePicker
App.DateField = Ember.TextField.extend({
    picker: null,

    updateValue: function() {
        var date = moment(this.get("date"));
        if (date.isValid()) {
            this.set("value", date.format("DD.MM.YYYY H:mm"));
            this.get("picker").setDate(date);
        } else {
            this.set("value", null);
        }
    }.observes("date"),

    updateDate: function() {
        var old_date = this.get("date");
        var date = moment(this.get("value"), "DD.MM.YYYY H:mm").toDate();
        date.setHours(old_date.getHours(), old_date.getMinutes(), old_date.getSeconds());
        // at least second changed
        if (Math.abs(date.getTime() - old_date.getTime()) > 1000) {
            this.set("date", date)
        }
    }.observes("value"),

    didInsertElement: function() {
        var picker = new Pikaday({
            field: this.$()[0],
            format: "DD.MM.YYYY H:mm"
        });
        this.set("picker", picker);
        this.updateValue();
    },

    willDestroyElement: function(){
        var picker = this.get("picker");
        if (picker) {
            picker.destroy();
        }
        this.set("picker", null);
    }
});

//tests
/*
 examples = [
 {title: "Мыть машину через 2 дня в 11"},
 {title: "Поздравить с ДР через год в 12:30"},
 {title: "Записаться на пятницу"},
 {title: "Проснуться 2 января"},
 {title: "Через 50 лет купить котедж"},
 {title: "Сегодня в 16 позвонить жене"},
 {title: "Через пять дней в 14:00 сюрприз"},
 {title: "Поздравить всех с НГ 31 декабря в 23"},
 {title: "Получить письмо в 18"},
 {title: "Послезавтра в 11 приехать за зарплатой"},
 {title: "Сегодня в 21 часов 30 минут выключить Дом2 "},
 {title: "Купить браслет Jawbone Up через 2 дня в 20:00"},
 {title: "Напомнить сделать рефакторинг в субботу"},
 {title: "Перезагрузить сервер в воскресение в 2"}
 ];


 var i = 0;
 while (i < examples.length) {
 console.log(examples[i].title, jsParseDate(examples[i].title));
 i++;
 }*/

function jsParseDate(title) {
    var word_capitalizations = title.split(" ");
    title = title.replace("одинадцать", "11").replace("двенадцать", "12").replace("тринадцать", "13").replace("четырнадцать", "14").replace("пятнадцать", "15").replace(" шестнадцать", " 16").replace(" семнадцать", " 17").replace(" двадцать", " 20").replace(" один", " 1").replace(" один", " 1").replace(" два", " 2").replace(" три", " 3").replace(" четыре", " 4").replace(" пять", " 5").replace(" шесть", " 6").replace(" семь", " 7").replace("восемь", "8").replace("девять", "9").replace("десять", "10").replace(" ноль", " 0");
    if (title) title = title.toLowerCase();
    var did = false;
    var mydate = new Date();
    var newdate = new Date();
    var d = new Object;
    d.myhours = 0;
    d.myminutes = 0;
    d.mydays = 0;
    d.mymonth = 0;
    d.myyears = 0;
    d.myweek = 0;
    var shablon = /(\d{1,2}.\d{1,2}.\d{4})/g;
    var matches = title.match(shablon);
    if (matches) {
        title = title.replace(shablon, "");
        shablon = /(\d{1,4})/g;
        var matches2 = matches[0].match(shablon);
        newdate.setDate(matches2[0]);
        newdate.setMonth(matches2[1] - 1);
        newdate.setFullYear(matches2[2]);
        did = true;
    }
    shablon = /(\d{1,2} янв)|(\d{1,2} фев)|(\d{1,2} мар)|(\d{1,2} апр)|(\d{1,2} мая)|(\d{1,2} май)|(\d{1,2} июн)|(\d{1,2} июл)|(\d{1,2} авг)|(\d{1,2} сен)|(\d{1,2} окт)|(\d{1,2} ноя)|(\d{1,2} дек)(\S*\s?\d{4}|\S*|$)/g;
    matches = title.match(shablon);
    if (matches) {
        var mymonth = 0;
        title = title.replace(matches[0], "");
        shablon = /(\d{4})/g;
        matches2 = matches[0].match(shablon); //найти год
        shablon = /((янв)|(фев)|(мар)|(апр)|(мая)|(май)|(июн)|(июл)|(авг)|(сен)|(окт)|(ноя)|(дек))/g;
        matches3 = matches[0].match(shablon); //найти месяц
        title = title.replace(shablon, "");
        shablon = /(\d{1,2})/;
        title = title.replace(shablon, "");
        matches4 = matches[0].match(shablon); //найти дату
        matches3[0] = matches3[0].substr(0, 3);
        if (matches3[0] == "янв") mymonth = 1;
        if (matches3[0] == "фев") mymonth = 2;
        if (matches3[0] == "мар") mymonth = 3;
        if (matches3[0] == "апр") mymonth = 4;
        if (matches3[0] == "мая") mymonth = 5;
        if (matches3[0] == "май") mymonth = 5;
        if (matches3[0] == "июн") mymonth = 6;
        if (matches3[0] == "июл") mymonth = 7;
        if (matches3[0] == "авг") mymonth = 8;
        if (matches3[0] == "сен") mymonth = 9;
        if (matches3[0] == "окт") mymonth = 10;
        if (matches3[0] == "ноя") mymonth = 11;
        if (matches3[0] == "дек") mymonth = 12;
        newdate.setDate(matches4[0]);
        newdate.setMonth(mymonth - 1);
        if (matches2) newdate.setFullYear(matches2[0]);
        did = true;
    }
    shablon = /(вчера)|(позавчера)|(сегодня)|(завтра)|(послезавтра)/g;
    matches = title.match(shablon);
    if (matches) {
        title = title.replace(shablon, "");
        console.log(title);
        if (matches[0] == "позавчера") var add_days = -2;
        if (matches[0] == "вчера") var add_days = -1;
        if (matches[0] == "сегодня") var add_days = 0;
        if (matches[0] == "завтра") var add_days = +1;
        if (matches[0] == "послезавтра") var add_days = +2;
        newdate.setDate(newdate.getDate() + add_days);
        did = true;
    }
    shablon = /(^|[^а-я0-9])[вк]?\s?(\d{1,2}\s?(ч[аса]*)?)([:\s]\d{1,2}(\sм[инуты]*\s|\s|$))?/;
    matches = title.match(shablon);
    if (matches) {
        var done = false;
        var hours = parseInt(matches[2].match(/\d{1,2}/)[0]);
        if (hours <= 23) {
            done = true;
        }
        if (matches[4]) {
            var minutes = parseInt(matches[4].match(/\d{1,2}/)[0]);
            if (hours <= 23 && minutes <= 59) {
                mydate.setMinutes(minutes);
                done = true;
            } else {
                done = false;
            }
        }
        if (done) {
            mydate.setHours(hours);
            title = title.replace(matches[0], " ");
        }
    }
    var matches2 = title.match(/\d{1,4}/g); //все двух-значные цифры
    var plus;
    shablon = /(дней|[\s\d]лет|нед\S*|год|мес\S*|день|дня|час\S+|мин\S+|\d{1,2}м|\d{1,2} м)/g;
    matches = title.match(shablon);
    //если "через 2 часа 30 минут"
    if (((title.indexOf("назад") != -1) || (title.indexOf("через") != -1)) && matches) {
        if (title.indexOf("через") != -1) {
            plus = "+";
        } else {
            plus = "-";
        }
        if (matches[0].substr(0, 3) == "час") //если указаны часы и минуты
        {
            if (matches2) {
                if (matches2[0]) {
                    d.myhours = plus + matches2[0];
                }
                if (matches2[1]) {
                    d.myminutes = plus + matches2[0];
                }
                mytime = ""; //это не время
            }
        }
        if (matches[0].substr(0, 3) == "мин" || (matches[0][matches[0].length - 1] == "м" && (title.indexOf("мес") == -1))) //если указаны только минуты
        {
            if (matches2) {
                if (matches2[0]) {
                    d.myminutes = plus + matches2[0];
                }
                mytime = ""; //это не время
            }
        }
        if (matches[0].substr(0, 3) == "нед") //если указаны только недели
        {
            if (matches2) {
                if (matches2[0]) {
                    d.myweek = plus + matches2[0];
                }
                ;
            }
            if (title.indexOf("через нед") != -1) {
                d.myweek = plus + 1
            } else if (title.indexOf("неделю назад")) {
                d.myweek = plus + 1
            }
            ;
        }
        if (title.indexOf("месяц") != -1) //если указаны только месяцы
        {
            if (matches2) {
                if (matches2[0]) {
                    d.mymonth = plus + matches2[0];
                }
                ;
            }
            if (title.indexOf("через мес") != -1) {
                d.mymonth = plus + 1;
            } else if (title.indexOf("месяц назад")) {
                d.mymonth = plus + 1
            }
            ;
        }
        if ((title.indexOf(" год") != -1) || (title.indexOf(" лет") != -1)) //если указаны только месяцы
        {
            if (matches2) {
                if (matches2[0]) {
                    d.myyears = plus + matches2[0];
                }
                ;
            }
            if (title.indexOf("через год") != -1) {
                d.myyears = plus + 1;
            } else if (title.indexOf("год назад")) {
                d.myyears = plus + 1
            }
            ;
        }
        if ((title.indexOf(" день") != -1) || (title.indexOf(" дня") != -1) || (title.indexOf(" дней") != -1)) //если указаны только месяцы
        {
            if (matches2) {
                if (matches2[0]) {
                    d.mydays = plus + matches2[0];
                }
                ;
            }
            if (title.indexOf("через год") != -1) {
                d.mydays = plus + 1;
                d.mydays = plus + 1;
            }
            ;
        }
        title = title.replace(/\d{1,4}/g, "");
        title = title.replace(shablon, "");
        title = title.replace(/(назад|через)/, "");
    }
    if (did) {
        newdate.setHours(mydate.getHours() + parseInt(d.myhours, 10));
        newdate.setMinutes(mydate.getMinutes() + parseInt(d.myminutes, 10));
        newdate.setSeconds(0);
        mydate = newdate;
    } else {
        mydate.setHours(mydate.getHours() + parseInt(d.myhours, 10));
        mydate.setMinutes(mydate.getMinutes() + parseInt(d.myminutes, 10));
        mydate.setSeconds(0);
    }
    mydate.setDate(mydate.getDate() + parseInt(d.mydays, 10) + parseInt(d.myweek * 7, 10));
    mydate.setMonth(mydate.getMonth() + parseInt(d.mymonth, 10));
    mydate.setYear(mydate.getFullYear() + parseInt(d.myyears, 10));
    shablon = /(?:в?\s?)((поне)|(втор)|(сред)|(четв)|(пятн)|(субб)|(воск))\S+/g;
    matches = title.match(shablon);
    if (matches) {
        week = 0;
        matches[0] = matches[0].replace(/(?:в?\s?)/, "");
        matches[0] = matches[0].substr(0, 4);
        if (matches[0] == "поне") week = 1;
        if (matches[0] == "втор") week = 2;
        if (matches[0] == "сред") week = 3;
        if (matches[0] == "четв") week = 4;
        if (matches[0] == "пятн") week = 5;
        if (matches[0] == "субб") week = 6;
        if (matches[0] == "воск") week = 7;
        if (week != 0) {
            mydate = nextWeekDay(mydate, week);
        }
        title = title.replace(shablon, "");
    }

    words = title.split(" ");

    // restoring capitalization
    var i = 0;
    for (i = 0; i < word_capitalizations.length; i++) {
        var word = word_capitalizations[i];
        var lower = word.toLowerCase();
        if (lower != word) {
            var index = words.indexOf(lower);
            if (index >= 0) {
                words[index] = word;
            }
        }
    }

    title = words.join(" ");

    return {
        date: mydate,
        rest: title
    };
} //jsParseDate

function nextWeekDay(date, day) { //поиск следующего дня недели
    (day = (Math.abs(+day || 0) % 7) - date.getDay()) < 0 && (day += 7);
    return day && date.setDate(date.getDate() + day), date;
}