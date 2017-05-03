//Returns array from fromNum to toNum that is sequential in order, both increasing and decreasing
const getRange = function(fromNum, toNum) {
	return Array.from({length: toNum - fromNum +1},
		(unused, i) => i + fromNum);
};

//Needlessly complicated function that will return the an array of letters that go from
// A to Z, then AA to AZ, then BA to BZ... to ZZ
const getLetterRange = function(firstLetter='A', numLetters) {
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters-1;
	let extendedLetterRange = [];
	for(let letter = rangeStart; letter < rangeEnd + 1; letter ++) {
		const aToZRange = Math.floor((letter-65)/26);
		if(aToZRange < 1 ) {
			extendedLetterRange.push(String.fromCharCode(letter));
		} else {
			extendedLetterRange.push(String.fromCharCode(aToZRange + 64) + String.fromCharCode(((letter - 64) % 26) + 64));
	}
		}
		return extendedLetterRange;
}
module.exports = {
	getRange: getRange,
	getLetterRange: getLetterRange
}  