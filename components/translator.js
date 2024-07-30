const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

let getKeyByValue = function(object, value) {
	return Object.keys(object).find(key => object[key] === value)
}

let dynamicRegex = function(word, index) {
	return new RegExp(String.raw`\b(?<!-)${word[index]}\b`, "gi")
	//return new RegExp(String.raw`\b\s${word[index]}\b|${word[index]}\b`, "gi")
}

let dynamicBritishTitlesRegex = function(word, index) {
	return new RegExp(String.raw`\b${word[index]}\b`, "gi")
}

let dynamicAmericanTitlesRegex = function(word, index) {
	return new RegExp(String.raw`${word[index]}`, "gi")
}


let escapeMetaChars = function(str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$&")
}

let capitalize = function(word) {
	return word.charAt(0).toUpperCase() + word.slice(1)
}

let americanOnlyKeys = Object.keys(americanOnly)
let britishTitlesKeys = Object.keys(americanToBritishTitles)
let britishSpellingKeys = Object.keys(americanToBritishSpelling)


class Translator {
    
	americanToBritish(text, locale) {
        
		let translation = text
		
		
		// TRANSLATING WORDS
		for (let i = 0; i < americanOnlyKeys.length; i++) {
			//console.log("words phase")      
			if (translation.toLowerCase().includes(americanOnlyKeys[i])) {
				console.log(dynamicRegex(americanOnlyKeys, i))
				translation = translation.replaceAll(dynamicRegex(americanOnlyKeys, i), `<span class="highlight">${americanOnly[americanOnlyKeys[i]]}</span>`)
				//console.log("modified:", translation)
			}
		}
		
		// TRANSLATING TITLES
 		for (let j = 0; j < britishTitlesKeys.length; j++) {
			//console.log("titles phase")
			if (translation.toLowerCase().includes(britishTitlesKeys[j])) {
				let titleUpperCased = capitalize(americanToBritishTitles[britishTitlesKeys[j]])
				console.log("title:", titleUpperCased)
				translation = translation.replaceAll(dynamicAmericanTitlesRegex(britishTitlesKeys, j), `<span class="highlight">${titleUpperCased}</span>`)
				//console.log("modded titles:", text)
			}
		}

		// TRANSLATING SPELLING
		for (let k = 0; k < britishSpellingKeys.length; k++) {
			if (translation.toLowerCase().includes(britishSpellingKeys[k])) {
				console.log(dynamicRegex(britishSpellingKeys, k))
				translation = translation.replaceAll(dynamicRegex(britishSpellingKeys, k), `<span class="highlight">${americanToBritishSpelling[britishSpellingKeys[k]]}</span>`)
				//console.log("modified:", text)
			}
		}

		// TRANSLATING TIME FORMAT
		let times = translation.match(/\b\d{2}[:]\d{2}\b/g)
		console.log("TIMES:", times)
		if (times) {
			for (let l = 0; l < times.length; l++) {
				if (translation.includes(times[l]))
				translation = translation.replaceAll(times[l], `<span class="highlight">${times[l].slice(0, 2) + "." + times[l].slice(3)}</span>`)
			}
		}

		if (text === translation) {
			return {"text": text, "translation": "Everything looks good to me!"}
		}

		console.log("TRANSLATED:", translation)
		return {"text": text, "translation": translation}
	}

	britishToAmerican(text, locale) {
		let britishOnlyKeys = Object.keys(britishOnly)
		//let americanTitlesKeys = Object.keys(americanToBritishTitles)
		//let britishSpellingKeys = Object.keys(americanToBritishSpelling)

		let translation = text
		
		for (let i = 0; i < britishOnlyKeys.length; i++) {
			if (translation.toLowerCase().includes(britishOnlyKeys[i])) {
				translation = translation.replaceAll(dynamicRegex(britishOnlyKeys, i), `<span class="highlight">${britishOnly[britishOnlyKeys[i]]}</span>`)
			}
		}

		for (let i = 0; i < britishTitlesKeys.length; i++) {
			if (translation.toLowerCase().includes(americanToBritishTitles[britishTitlesKeys[i]])) {
				let titleUpperCased = capitalize(britishTitlesKeys[i])
				console.log(titleUpperCased)
				translation = translation.replaceAll(dynamicBritishTitlesRegex(americanToBritishTitles, britishTitlesKeys[i]), `<span class="highlight">${titleUpperCased}</span>`)
				
			}
		}

		// BRITISH-TO-US SPELLING
		for (let i = 0; i < britishSpellingKeys.length; i++) {
			if (translation.toLowerCase().includes(americanToBritishSpelling[britishSpellingKeys[i]])) {
				translation = translation.replaceAll(dynamicRegex(americanToBritishSpelling, britishSpellingKeys[i]), `<span class="highlight">${britishSpellingKeys[i]}</span>`)
			}
		}

		// TRANSLATING TIME FORMAT
		let times = translation.match(/\b\d{1}[.]\d{2}\b|\b\d{2}[.]\d{2}\b/g)
		//console.log("TIMES:", times)
		if (times) {
			for (let l = 0; l < times.length; l++) {
				if (translation.includes(times[l]) && times[l].length === 4) {
					translation = translation.replaceAll(times[l], `<span class="highlight">${times[l].slice(0, 1) + ":" + times[l].slice(2)}</span>`)
				} else if (translation.includes(times[l]) && times[l].length === 5) {
					translation = translation.replaceAll(times[l], `<span class="highlight">${times[l].slice(0, 2) + ":" + times[l].slice(3)}</span>`)
				}
				
			}
		}
		
		if (text === translation) {
			return {"text": text, "translation": "Everything looks good to me!"}
		}

		console.log("BRIT-TO-US:", translation)
		return {"text": text, "translation": translation}
	}
}

module.exports = Translator;