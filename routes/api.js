'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
			console.log("BODY:", req.body)
			if (req.body.text === "") {
				res.json({ error: 'No text to translate' })
			} else if (!req.body.text || !req.body.locale) {
				res.json({ error: 'Required field(s) missing' })
			} else if (!req.body.locale.match(/\bamerican-to-british\b|\bbritish-to-american\b/)) {
				res.json({ error: 'Invalid value for locale field' })
			} else if (req.body.locale.match(/\bamerican-to-british\b/)) {
				res.json(translator.americanToBritish(req.body.text))
			} else if (req.body.locale.match(/\bbritish-to-american\b/)) {
				res.json(translator.britishToAmerican(req.body.text))
			}
    });
};

/* Mangoes are my favorite fruit. 
I ate yogurt for breakfast. 
We had a party at my friend's condo. 
Can you toss this in the trashcan for me?
The parking lot was full. 
Like a high tech Rube Goldberg machine. 
To play hooky means to skip class or work. 
No Mr. Bond, I expect you to die. 
Dr. Grosh will see you now. 
Lunch is at 12:15 today. */

/* Paracetamol takes up to an hour to work.
First, caramelise the onions.
I spent the bank holiday at the funfair.
I had a bicky then went to the chippy.
I've just got bits and bobs in my bum bag.
The car boot sale at Boxted Airfield was called off.
Have you met Mrs Kalyani?
Prof Joyner of King's College, London.
Tea time is usually around 4 or 4.30.
*/