## Часть проектов сделанных во время обучения в летней школе Яндекса

### 1. [Веб-краулер](/1-webCrawler)

- Написать программу-краулер с использованием Node.js, которая будет проходить по указанному URL-адресу обходить все страницы на сайте и собирать список всех ссылок на другие страницы.

- Не более 1 ретрая на неудачную попытку.

- Используется поставляемая библиотека fetcher.

### 2. [Async fn](/2-asyncMarket/)

- Напиcать функцию, которая принимает объект со свойствами: minPrice, maxPrice и catalog и возвращает массив активных товаров, принадлежащих активным категориям и попадающим в ценовой диапазон от minPrice до maxPrice.

- Он должен быть отсортирован по цене в порядке возрастания, а при равной цене - по имени товара в лексикографическом порядке.

- Методы выполняются со случайной задержкой и с вероятностью 0.2 возвращают ошибку. В случае ошибки необходимо повторно вызывать метод, пока он не выполнится успешно.

### 3. [Eslint plugin](/3-esLint/)

- Написать для ESLint плагин, в котором будет своё правило с фиксом:

  - Правило должно проверять, отсортированы ли импорты по путям модулей и предлагать отсортировать их.

  - Игнорировать вложенные в блочные конструкции динамические импорты import().

  - Перемещать комментарии к импорту вместе с этим импортом.

### 4. [Fn-constructor](/4-proJs/)

- Написать функцию-конструктор, которая принимает на вход 3 числа: from (начало последовательности), to (конец последовательности), step (шаг последовательности).

- У объект должна быть возможность обойти все элементы числовой последовательности с помощью цикла for..of и получить всю последовательность при деструктуризации этого объекта.

- Объект не должен иметь собственных перечисляемых свойств и методов, а его прототип должен иметь только методы constructor и setStep.

- Нельзя хранить полную числовую последовательность.

- Преобразованием String(Sequence(0, 10, 1)) должна быть строка: ’Sequence of numbers from 0 to 10 with step 1’.

- Наличие метода, который может менять шаг и обновлять последовательность двигая начала на текущее число.
