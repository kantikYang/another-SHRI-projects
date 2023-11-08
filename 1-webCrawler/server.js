const express = require('express');
const { fetcher } = require('../fetcher');
const port = 3000;

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
  res.send('sup');
});

app.post('/parse', function (req, res) {
  const { body } = req;

  crawler(body.domainName).then((data) => {
    res.send(data);
  });
});

app.listen(port);

async function validFetch(url, retr = 2) {
  if (retr < 1) return false;

  const myLink = await fetcher(url);

  if (myLink.status >= 200 && myLink.status < 300) return myLink;

  return await validFetch(url, --retr);
}

function findLinks(html) {
  const linkRegex = /<a.*?href="(.*?)".*?>/gu;

  return Array.from(html.matchAll(linkRegex), (m) => m[1]);
}

async function crawler(root) {
  const stack = [root];
  const visitedUrl = new Set();

  while (stack.length > 0) {
    const currentLink = stack.pop(); // берем из конца стека

    if (visitedUrl.has(currentLink)) continue; // проверка посещали или нет

    const currentAns = await validFetch(currentLink);

    if (currentAns === false) continue; // валидность ссылки
    visitedUrl.add(currentLink);

    const content = await currentAns.text();

    const link = findLinks(content); // собираем ссылки
    link.forEach((el) => stack.push(el)); // пушим в стек
  }

  return Array.from(visitedUrl);
}

/*
    TODO: краулер страницы
    POST http://localhost:3000/parse
    body: { domainName: string}
    return string[]
*/
