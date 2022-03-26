const body = document.querySelector('body');

// element that will hold all the text 
const interfaceElement = document.createElement('div');
interfaceElement.setAttribute('id', 'interface');


body.appendChild(interfaceElement);

injectStylesheet();

class Interface {
  constructor(data) {
    console.log(data)
    this.data = []; // internal data structure 
    if (data.length === 0 || typeof data[0] !== 'object') {
      this.render(true);
      this.makeInvisible();
      alert('No definition for this word(s)')
      return;
    }
    else {
      this.parse(data);
      this.render(true);
    }
  }

  /**
   * This function parses our api data and stores in our this.data array data structure 
   * 
   * @param {array} data array of objects containing the words from our api 
   */
  parse(data) {
    // for each word object 
    data.forEach(wordObject => {
      // create a new simplified word object 
      const simplifiedWord = {
        word:  this.parseWord(wordObject), 
        shortDefs: this.parseShortDefs(wordObject),
        partOfSpeech: wordObject['fl'],
        synonyms: this.parseSynonyms(wordObject),
        pronunciations: this.parsePronunciations(wordObject)
      };

      this.data.push(simplifiedWord); // <== may need to reverse this.data before rendering to interface 
    })
  }

  render(invisible = false) {
    if (invisible === true) {
      this.resetStyling();
      return;
    }
    // console.log(this.data)
    this.resetStyling();

    this.node = interfaceElement;
    const xButton = document.createElement('button');
    xButton.innerText('X');
    xButton.addEventListener('click', (e) => {
      this.render(false);
    })
    xButton.setAttribute('id', 'xButton');

    this.node.appendChild(xButton);

    for (let i = 0; i < this.data.length; i++) {

      //adding elements to node
      //adding the selected word as h2
      const selectedWord = document.createElement('h2');
      selectedWord.setAttribute('class', 'selected-word');
      selectedWord.innerText = this.data[i].word;
      this.node.appendChild(selectedWord);

      //adding the part of speech
      const partOfSpeech = document.createElement('h3');
      partOfSpeech.setAttribute('class', 'speech');
      partOfSpeech.innerText = this.data[i].partOfSpeech;
      this.node.appendChild(partOfSpeech);

      //adding short definitions
      const shortDefsArr = this.data[i].shortDefs;
      const defsList = document.createElement('ul');
      defsList.setAttribute('class', 'def-list');
      this.node.appendChild(defsList);
      shortDefsArr.forEach( el => {
        const defsListItem = document.createElement('li');
        defsListItem.setAttribute('class', 'def-list-item');
        defsListItem.innerText = el;
        defsList.appendChild(defsListItem);
      })
   }
  }

  makeInvisible() {
    interfaceElement.style.visibility = 'hidden'
  }

  resetStyling() {
    interfaceElement.innerHTML = '';
    interfaceElement.style.visibility = 'visible';
    interfaceElement.style.position = 'fixed';
    interfaceElement.style.right = '0px';
    interfaceElement.style.top = '0px';
    interfaceElement.style.backgroundColor = 'rgba(245,245,245, .85)';
    interfaceElement.style.width = '300px';
    interfaceElement.style.height = '500px';
    interfaceElement.style.overflowY = 'scroll';
    interfaceElement.style.zIndex = '100';
    interfaceElement.style.padding = '50px'
  }

  /**
   * This method extracts the shortdef property array from the wordObject and returns it 
   * @param {object} wordObject 
   * @returns an array of strings containing the shortened definition of the wordObject
   */
  parseShortDefs(wordObject) {
    // return array of shortdefs 
    const shortdefArr = Object.values(wordObject['shortdef']);
    return shortdefArr;
  }


  // TODO <------------------------------------------------- FIX 
  parseSynonyms(wordObject) {
    //traverse data structure
      //syns (array, length 1) -> object with keys 'pl' (string that says 'synonyms)
      // and pt (array)
    if (!wordObject.syns) return [];
    let synString = wordObject.syns[0].pt[0][1];
    synString = synString.replace('{/sc}', '');
    const synArray = synString.split('{sc}');
    const synFilter = synArray.filter(el => el.length < 15);
    return synFilter;
  }

  /**
   * This method parses the wordObject of the string from the wordObject.meta.id property,
   * stripping any numbers or : characters at the end 
   * @param {object} wordObject 
   * @returns string representing the wordObject
   */
  parseWord(wordObject) {
    let wordString = String(wordObject.meta.id);
    // while the last character is a number or ':', strip the character and reassign 
    while (!isNaN(wordString[wordString.length - 1]) ||  wordString[wordString.length - 1] === ':')  {
      wordString = wordString.slice(0, wordString.length - 1);
    }
    return wordString
  }

  /**
   * This method parses the wordObject of the pronunciations properties, 
   * returning an array of strings 
   * @param {object} wordObject 
   * @returns an array containing all string pronunciations 
   */
  parsePronunciations(wordObject) {
    const pronunciationsArr = wordObject.hwi.prs;
    if (!pronunciationsArr || pronunciationsArr.length === 0) return [];
    const output = [];
    pronunciationsArr.forEach(pronun => {
      output.push(pronun.mw);
    })
    return output; 
  }  
}


document.addEventListener('keydown', (e) => {

  const highlightedText = document.getSelection().toString();
  
  // if keyboard event is not 'ctrl' + 1 or if no text is selected, exit callback func 
  if (
    !(e.ctrlKey === true && e.key === '1') ||
    !highlightedText ||
    highlightedText === ''
  ) return; 
  
  // prepares the text for inserting into the query string 
  highlightedText.trim();
  highlightedText.replace(' ', '%20');
  
  //test dictionary API
  fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${highlightedText}?key=89e6d1b8-1e07-4b38-b36d-2ddd665e493c`)
    .then((data) => data.json())
    .then((data) => {
      // create instance of Interface class
      const interface = new Interface(data);
  })
})


/**
 * Injects the local style.css file into our destination window 
 */
function injectStylesheet() {
  const link = document.createElement('link');
  link.href = './style.css';
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

