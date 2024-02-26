const text = document.querySelector('article p');
const textContent = text.innerHTML;
const textArray = textContent.split(/(\s+)/); // Use regex to split while preserving spaces

textArray.forEach((word, index) => {
    if (word.includes('#')) {
        const word2 = word.replace('#', '');
        textArray[index] = `<a href="https://twitter.com/search?q=%23${word2}&src=typed_query" class="highlight">${word}</a>`;
    }
});

text.innerHTML = textArray.join(''); // Join without spaces

