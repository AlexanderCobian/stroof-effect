# Stroof Effect

This is a goofy little game based on Stroop test games which are in turn based on the [Stroop Effect](https://en.wikipedia.org/wiki/Stroop_effect).

[Play it here.](https://alexandercobian.github.io/stroof-effect/)

## Lessons learned

My basic goal here was to bust out my very rusty HTML, CSS, and JS skills and deploy something fun and silly quickly, using AI as Google++ but writing everything by hand. I thought that this project would be extremely fast to complete, and for the most part it was, but by this point at least 50-75% of the development time has been trying to figure out why sounds sometimes don't play when they ought to. Turns out browsers are pretty hostile to JavaScript just being like "hey I'd like to play sounds now" unless it's in direct response to user input. And "direct" is apparently pretty important there, because, I mean, this game doesn't do anything at all without user input, so I wouldn't have thought it would be a problem, but browsers seem to get upset if there's even too many layers of logic happening in between the input and the audio playing.

I ultimately gave up on having a deep, intimate understanding of each line of code because it wasn't worth it at this moment to spend many more hours understanding the nuances of the social contract between JavaScript and browers as it pertains to audio, so some of that audio context setup is just me saying "ok Claude i trust u". Maybe something for me to learn more about later.