const quoteContainer = document.getElementById('quote-container')
const quoteText = document.getElementById('quote')
const authorText = document.getElementById('author')
const twitterBtn = document.getElementById('twitter')
const newQuoteBtn = document.getElementById('new-quote')
const loader = document.getElementById('loader')


function showLoadingSpiner() {
    loader.hidden = false
    quoteContainer.hidden = true
}

function hideLoadingSpiner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false
        loader.hidden = true
    }
}

// Get Quote From API
let requestErrorCounter = 0;
let duplicatedQuoteRequestCounter = 0;
async function getQuote() {

    showLoadingSpiner()
    try {
        const responseData = await connectToQuoteAPI()

        if (quoteTextIsDuplicated(responseData.quoteText)) {
            showLoadingSpiner()
            console.log('quote was duplicated')
            duplicatedQuoteRequestCounter < 20 ? getQuote() : goTo404Page()
            
        } else {
            assingAuthorName(responseData)
            reduceFontSizeForLongQuote(responseData.quoteText)
            assingQuoteText(responseData)
            hideLoadingSpiner()
            throw new Error('bub')
        }
        
    } catch (error) {
        requestErrorCounter += 1;
        requestErrorCounter < 20 ? getQuote() : goTo404Page();
        console.log('whoops, no quote', error);
    }
    
    function goTo404Page()
    {
      window.location = '/404.html';   
    }

    function quoteTextIsDuplicated(text) {
        return document.getElementById('quote').textContent === text 
    }

    function assingQuoteText(responseData) {
        quoteText.innerText = responseData.quoteText
    }

    function assingAuthorName(responseData) {
        authorText.innerText = responseData.quoteAuthor || '-Unknow'
    }

    async function connectToQuoteAPI() {
        const proxyUrl = 'https://evening-ravine-24129.herokuapp.com/'
        const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    
        const response = await fetch(proxyUrl + apiUrl)
        const responseData = await response.json()
        return responseData
    }

    function reduceFontSizeForLongQuote(text) {
        text.length > 100 
        ? quoteText.classList.add('long-quote') 
        : quoteText.classList.remove('long-quote')
    }

    
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote}
    -${author}`;
    window.open(twitterUrl, '_bloank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// Load Page
getQuote()