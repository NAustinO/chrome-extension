const body = document.querySelector('body');
// contents.parentNode.removeChild(contents);



/*
// word were looking up 
// fl (adjecrtive, etc)
// dt - an array containing text and verbal illustration (vis) of the definition


class Word {
  constructor() {
    this.wordName;
    this.shortDefs = [];
    this.audioFile 
    this.pronunciation; 
  }
}


data = [
  {}
]
*/
//create interface class
class Interface {
  constructor(data) {
    //store data retrieved from dictionary API
    this.data = []; 
    this.parse(data);
    //creates popup window in browser
    this.node = document.createElement('div');
    this.node.setAttribute('class', 'interface');
    body.appendChild(node);
  
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
      const simplifiedWord = {};
      // add our chosen data from api into our simplified word object 
      simplifiedWord[word] = this.parseWord(wordObject);  // -> string 
      simplifiedWord[shortDefs] = this.parseShortDefs(wordObject);  // -> array of strings 
      simplifiedWord[partOfSpeech] = wordObject['fl'];  // -> string 
      simplifiedWord[synonyms] = this.parseSynonyms(wordObject); // -> array of strings 
      simplifiedWord[pronunciations] = this.parsePronunciations(wordObject);

      // remove after debugging 
      console.log(simplifiedWord);

  
      // push to this.data 
      this.data.push(simplifiedWord); // <== may need to reverse this.data before rendering to interface 
    })
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

  parseSynonyms(wordObject) {
    //traverse data structure
      //syns (array, length 1) -> object with keys 'pl' (string that says 'synonyms)
      // and pt (array)
    if (!wordObject.syns) return [];
    const synString = wordObject.syns[0].pt[0][1];
    synString = synString.replace('{/sc}', '');
    const synArray = synString.split('{sc}');
    synFilter = synArray.filter(el => el.length > 15);
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





document.addEventListener('mousedown', (e) => {
  console.log('mouse clicked ')
})




document.addEventListener('keydown', (e) => {
  // e is of KeyboardEvent class
  console.log('in event listener ')
    // gets highlighted text 
  const highlightedText = document.getSelection().toString();
  
  // if keyboard event is not 'ctrl' + 1 or if no text is selected 
  if (
    !(e.ctrlKey === true && e.key === 1) ||
    !highlightedText ||
    highlightedText === ''
  ) {
    console.log('event listener was called, but exited since it wasnt the right key')
    return; 
  } 
  console.log('event listener was called with right keys')
  
  // replaces spaces with '%20'  
  highlightedText.replace(' ', '%20');
  
  //test dictionary API
  fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${highlightedText}?key=89e6d1b8-1e07-4b38-b36d-2ddd665e493c`)
  .then((data) => data.json())
  .then((data) => {

    // create instance of Interface class
    const interface = new Interface(data);
    // interface.parse(data);
    
      // within instance 
    console.log(data);
  })

  
})


// //test dictionary API
fetch('https://dictionaryapi.com/api/v3/references/collegiate/json/selection?key=89e6d1b8-1e07-4b38-b36d-2ddd665e493c')
  .then((data) => data.json())
  .then((data) => {
    console.log(data);
  })
  