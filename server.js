const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio"); //"cheerio" is a web scrapping node package
const { response } = require("express");
const PORT = 3000;

const app = express();

const newBooks = [];

const Books = [];

const categories = [
  {
    name: "best-sellers1",
    address:
      "https://www.amazon.com/Best-Sellers-Books/zgbs/books/283155/ref=zg_bs_pg_2?_encoding=UTF8&pg=1",
  },
  {
    name: "best-sellers2",
    address:
      "https://www.amazon.com/Best-Sellers-Books/zgbs/books/283155/ref=zg_bs_pg_2?_encoding=UTF8&pg=2",
  },
  {
    name: "most-wished1",
    address:
      "https://www.amazon.com/gp/most-wished-for/books/69771/ref=zg_mw_pg_2?ie=UTF8&pg=1",
  },
  {
    name: "most-wished2",
    address:
      "https://www.amazon.com/gp/most-wished-for/books/69771/ref=zg_mw_pg_2?ie=UTF8&pg=2",
  },
  {
    name: "most-gifted1",
    address:
      "https://www.amazon.com/gp/most-gifted/books/69771/ref=zg_mg_pg_2?ie=UTF8&pg=1",
  },
  {
    name: "most-gifted2",
    address:
      "https://www.amazon.com/gp/most-gifted/books/69771/ref=zg_mg_pg_2?ie=UTF8&pg=2",
  },
  {
    name: "new-releases1",
    address:
      "https://www.amazon.com/gp/new-releases/books/ref=zg_bsnr_pg_2?ie=UTF8&pg=1",
  },
  {
    name: "new-releases1",
    address:
      "https://www.amazon.com/gp/new-releases/books/ref=zg_bsnr_pg_2?ie=UTF8&pg=2",
  },
];

categories.map((category) => {
  axios
    .get(category.address)
    .then(function (response) {
      const html = response.data;

      const $ = cheerio.load(html);
      $("div.zg-grid-general-faceout")
        .find("a.a-link-normal")
        .each(function () {
          const url = $(this).find("img.p13n-product-image").attr("src");
          let text = "";
          text += $(this).text();
          Books.push(text);
          url && Books.push(url);
        });
      var i = 0;
      while (i < Books.length) {
        if (Books[i + 4] && Books[i + 2] && Books[i + 3]) {
          newBooks.push({
            title: Books[i + 2],
            rating: Books[i + 3],
            price: Books[i + 4],
            category: category.name,
            img: Books[i + 1],
          });
        }

        i += 5;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/", function (req, res) {
  res.json("Welcome to my weather API");
});

app.get("/books", function (req, res) {
  console.log("BOOKS : ", Books);
  res.json(newBooks);
});

/*
app.get("/books/:bookId", function (req, res) {
  //we'll use the req.params to see what newspaper the user selected
  console.log(req.params);

  const newspaperId = req.params.newspaperId;

  //get the newspaper selected
  const newspaper = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0];

  //console.log(newspaper);
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const speceficArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        speceficArticles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
      res.json(speceficArticles);
    })
    .catch(function (err) {
      console.log(err);
    });
});*/

app.listen(PORT, () => console.log("server is running on ", PORT));

//Now you can scall it even more and see what article the user selected
