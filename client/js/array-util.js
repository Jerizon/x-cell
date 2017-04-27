const getRange = function(fromNum, toNum) {
	return Array.from({length: toNum - fromNum +1},
		(unused, i) => i + fromNum);
};
const getLetterRange = function(firstLetter='A', numLetters) {
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters-1;
	let extendedLetterRange = [];
	for(let letter = rangeStart; letter < rangeEnd + 1; letter ++) {
		const aToZRange = Math.floor((letter-65)/26);
		if(aToZRange < 1 ){
			extendedLetterRange.push(String.fromCharCode(letter));
		} else {
			extendedLetterRange.push(String.fromCharCode(aToZRange + 64) + String.fromCharCode((letter - 65) % 26));
	}
		}
		
	/*return getRange(rangeStart, rangeEnd)
		.map(charCode => String.fromCharCode(charCode));*/
		return extendedLetterRange;
}
module.exports = {
	getRange: getRange,
	getLetterRange: getLetterRange
}