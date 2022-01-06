
REQUIRED FILES: 
manifest.json is required by chrome
main.js file 

*/
The “manifest_version” tells Chrome about the format of the manifest. We'll be using version 2.
The “name” is what we call our extension and how it will be listed with Google. We’ll call our extension “Focus“.
The “version” field helps Google keep track of updates we make after our extension is published to the world. This needs to be a string, so we’ll call ours “1.0”.

{
  "manifest_version": 2,
  "name": "Focus",
  "version": "1.0"
}

*/
We need to add content scripts within manifest file to link to our main js

"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["./main.js"]
  }
]

Keys to Webster Dictionary API
Dictionary Key - 89e6d1b8-1e07-4b38-b36d-2ddd665e493c
Direct browser URL: https://dictionaryapi.com/api/v3/references/collegiate/json/test?key=89e6d1b8-1e07-4b38-b36d-2ddd665e493c

Thesaurus Key - 39a41de1-1782-4eba-98b5-58f7564cd5f1
Direct browser URL: https://dictionaryapi.com/api/v3/references/thesaurus/json/test?key=39a41de1-1782-4eba-98b5-58f7564cd5f1






WISHLIST: 
- extract audio file and make button to play it 
