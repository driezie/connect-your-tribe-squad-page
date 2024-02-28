const textEl = document.querySelector("article p");
const textContent = textEl.innerHTML;
const textArray = textContent.split(/(\s+)/); // Use regex to split while preserving spaces
const query = new URLSearchParams(window.location.search);
const sortEl = document.querySelector("select.sort");
const filterEl = document.querySelector("select.filter");
const searchEl = document.querySelector("input.search");

const filtersBtn = document.querySelector(".title > button");
const filtersEl = document.querySelector(".filters");

textArray.forEach((word, index) => {
  if (word.includes("#")) {
    const word2 = word.replace("#", "");
    textArray[
      index
    ] = `<a href="https://twitter.com/search?q=%23${word2}&src=typed_query" class="highlight">${word}</a>`;
  }
});

if (query.get("sort")) {
  switch (query.get("sort")) {
    case "":
      sortEl.selectedIndex = 1;
      break;
    case "all":
      sortEl.selectedIndex = 1;
      break;
    case "name":
      sortEl.selectedIndex = 2;
      break;
    case "surname":
      sortEl.selectedIndex = 3;
      break;
  }
}

if (query.get("filter")) {
  switch (query.get("filter")) {
    case "":
      filterEl.selectedIndex = 1;
      break;
    case "all":
      filterEl.selectedIndex = 1;
      break;
    case "3":
      filterEl.selectedIndex = 2;
      break;
    case "4":
      filterEl.selectedIndex = 3;
      break;
    case "5":
      filterEl.selectedIndex = 4;
      break;
  }
}

if (query.get("search") && query.get("search") != "") {
  searchEl.value = query.get("search");
}

filtersBtn.addEventListener("click", (e) => {
  filtersEl.classList.toggle("opened");
  filtersEl.classList.toggle("border-animation");
});

filtersEl.addEventListener("animationend", (e) => {
  filtersEl.classList.toggle("border-animation");
});

textEl.innerHTML = textArray.join(""); // Join without spaces
