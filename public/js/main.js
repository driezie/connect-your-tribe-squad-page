const textEl = document.querySelector('article p');
const textContent = textEl.innerHTML;
const textArray = textContent.split(/(\s+)/); // Use regex to split while preserving spaces
const query = new URLSearchParams(window.location.search);
const filterEl = document.querySelector('select.filter');

textArray.forEach((word, index) => {
    if (word.includes('#')) {
        const word2 = word.replace('#', '');
        textArray[index] = `<a href="https://twitter.com/search?q=%23${word2}&src=typed_query" class="highlight">${word}</a>`;
    }
});

if (query.get('filter')) {
    switch (query.get('filter')) {
      case "":
        filterEl.selectedIndex = 1
        break;
      case "all":
        filterEl.selectedIndex = 1
        break;
      case "3":
        filterEl.selectedIndex = 2
        break;
      case "4":
        filterEl.selectedIndex = 3
        break;
      case "5":
        filterEl.selectedIndex = 4
        break;
    }
};

textEl.innerHTML = textArray.join(''); // Join without spaces
