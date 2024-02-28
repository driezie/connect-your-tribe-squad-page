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

// Function to save the selected option in localStorage
function saveSelectedOption(selectElement) {
    localStorage.setItem("selectedOption", selectElement.selectedIndex);
  }
  
  // Function to set the selected option when the page loads
  window.onload = function () {
    var savedIndex = localStorage.getItem("selectedOption");
    if (savedIndex !== null) {
      document.querySelector("select").selectedIndex = savedIndex;
    }
  };