/**
* Title: LoremPress
* Description: Dummy text generator.
* Version: 1.3.2
* Author: Israel Martins
*/

const initiateLoremPress = () => {
    /* Text generator initialisation message */
    const loremPressInitMessage = 'Init LoremPress ✔';

    /* Minimum and Maximum number of words in a sentence */
    const minSentenceWords = 11;
    const maxSentenceWords = 20;

    /* Minimum and Maximum number of sentences in a paragraph */
    const minParagraphSentences = 7;
    const maxParagraphSentences = 10;

    /* For the output paragraph */
    let theParagraph;

    let arrayOfParagraphs = [];

    let paragraphIndex = 0;

    /* Random number */
    const randomNumber = () => {
        return Math.random();
    };

    /* Random integer */
    const randomInteger = () => {
        return Math.floor(randomNumber() * 10);
    }

    /* Restricts random integer to range */
    const restrictRandomIntegerToRange = (min, max) => {
        return Math.min(Math.max(min, randomInteger()), max);
    };

    /* Gets a random integer from a range */
    const getRandomIntegerFromRange = (min, max) => {
        return Math.floor(randomNumber() * (max - min + 1)) + min;
    };

    /* Pick a word group */
    const selectRandomArrayIndex = (arrayOfWords) => {
        const minIndex = 0;
        const maxIndex = arrayOfWords.length - 1;

        const selectedStringOfWordsIndex = restrictRandomIntegerToRange(minIndex, maxIndex);

        return arrayOfWords[selectedStringOfWordsIndex];
    };

    /* Converts a string to an array */
    const convertStringToArray = (string) => {
        return string.split(' ');
    };

    /* Gets the index of the last item in an array */
    const getLastArrayIndex = (array) => {
        const lastArrayIndex = array.length - 1;

        return lastArrayIndex;
    };

    /* Picks the index of an array item at random */
    const getRandomArrayIndex = (array) => {
        const lastArrayIndex = getLastArrayIndex(array);

        return restrictRandomIntegerToRange(0, lastArrayIndex);
    };

    /* Picks sentence word count at random */
    const pickRandomSentenceWordCount = () => {
        return restrictRandomIntegerToRange(minSentenceWords, maxSentenceWords);
    };

    /* Picks sentence count at random */
    const pickRandomSentenceCount = () => {
        return restrictRandomIntegerToRange(minParagraphSentences, maxParagraphSentences);
    };

    /* Capitalises the first letter in a string */
    const capitaliseFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    /* Generates a sentence of random words */
    const makeRandomSentenceFromArray = (array) => {
        /**
        * sentenceWords: words that would make up the sentence are passed to this array
        *
        * theSentence: the eventual sentence
        *
        * sentenceWordCount: randomly generates the number of words (word count) of the sentence
        *
        * lastArrayIndex: the index of the last item in the source array
        *
        * arrayIndex: a radomly generated array item index
        */
        let sentenceWords = [];
        let theSentence;
        const sentenceWordCount = pickRandomSentenceWordCount();
        const lastArrayIndex = getLastArrayIndex(array);
        const arrayIndex = () => {
            return getRandomArrayIndex(array);
        };

        /* Populate the sentenceWords with words until its word count is equal to sentenceWordCount */
        while (sentenceWordCount > sentenceWords.length) {
            sentenceWords.push(array[arrayIndex()]);
        }

        /*
        * Prevent words from appearing more than once in a sentence.
        */
        sentenceWords.reduce(
            (nonRepeatingArray, arrayItem) => {
                if (nonRepeatingArray.indexOf(arrayItem) === -1) {
                    nonRepeatingArray.push(arrayItem);
                }

                /* Replace the sentenceWords array items with the items in the nonRepeatingArray's items */
                sentenceWords = nonRepeatingArray;

                return nonRepeatingArray;
            }, []
        );

        /* Merge the array of words into a sentence */
        theSentence = sentenceWords.join(' ');

        /* Capitalise first letter in setence */
        theSentence = capitaliseFirstLetter(theSentence);

        /* Add a full stop at the end of the sentence */
        theSentence += '.';

        return theSentence;
    };

    /* Paragraph count input field */
    const paragraphCountField = document.querySelector('#paragraph-count-field');

    /* Text generation trigger button */
    const textGenerationTrigger = document.querySelector('.generate-text-trigger');

    /* Reset trigger */
    const resetTrigger = document.querySelector('.reset-trigger');

    /* Page output section */
    const outputSection = document.querySelector('.generated-text-area');

    /* Copiable generated text */
    const copiableGeneratedText = document.querySelector('.copiable-generated-text');

    /* Copy text button */
    const copyButton = document.querySelector('.copy-text');

    /* Generates text */
    const generateText = () => {
        /* Remove the "empty" class from the output section element */
        outputSection.classList.remove('empty');

        const xhr = new XMLHttpRequest();

        xhr.open('GET', './source/source-dummy-text.json', true);

        xhr.onload = function() {
            if (this.status === 200) {
                const responseText = JSON.parse(this.responseText);

                /* Pick a string of words at random */
                const stringOfWords = selectRandomArrayIndex(responseText).words;

                /* Convert the string of words to an array of words */
                const arrayOfWords = convertStringToArray(stringOfWords);

                /* Create array of sentences */
                let arrayOfSentences = [];

                /* Populate the arrayOfSentences */
                while (arrayOfSentences.length < pickRandomSentenceCount()) {
                    arrayOfSentences.push(makeRandomSentenceFromArray(arrayOfWords));
                }

                /* Create a paragraph from the array of sentences */
                theParagraph = arrayOfSentences.join(' ');

                /* Output the number of paragraphs requested */
                if (paragraphCountField.value > arrayOfParagraphs.length) {
                    arrayOfParagraphs.push(theParagraph);
                    outputSection.innerHTML += `<p>${arrayOfParagraphs[paragraphIndex]}</p>`;
                    copiableGeneratedText.innerHTML += `${arrayOfParagraphs[paragraphIndex]}`;

                    /* Add line breaks to all paragraphs except the last */
                    if (paragraphCountField.value > arrayOfParagraphs.length) {
                        copiableGeneratedText.innerHTML += `\n\n`;
                        paragraphIndex++;
                    } else {
                        showCopyButton();
                    }

                    return generateText();
                }
            }
        };

        xhr.send();
    };

    /* Shows the reset trigger */
    const showResetTrigger = () => {
        resetTrigger.classList.add('active');
    };

    /* Hides the reset trigger */
    const hideResetTrigger = () => {
        resetTrigger.classList.remove('active');
    };

    /* Shows the copy button */
    const showCopyButton = () => {
        copyButton.classList.add('active');
    };

    /* Hides the copy button */
    const hideCopyButton = () => {
        copyButton.classList.remove('active');
    };

    let unsetCopiedState;

    /* Resets copy button if in "Copied" state */
    const clearCopiedState = () => {
        if (copyButton.classList.contains('copied')) {
            clearTimeout(unsetCopiedState);
            copyButton.classList.remove('copied');
        }
    };

    /* Resets the form and output */
    const doReset = () => {
        arrayOfParagraphs = [];
        paragraphIndex = 0;
        outputSection.innerHTML = '';
        copiableGeneratedText.innerHTML = '';
        outputSection.classList.add('empty');
        clearCopiedState();
        copyButton.classList.contains('active') && copyButton.classList.remove('active');
    };

    /* Outputs generated text */
    const outputGeneratedText = () => {
        /* Reset the input and output variables */
        doReset();

        /* Only generate text when the requested paragraph count is greater or equal to 1 */
        if (paragraphCountField.value >= 1) {
            /* And activate the copy button */
            generateText();
            showResetTrigger();
            clearCopiedState();
        } else {
            /* Otherwise, deactivate the copy button */
            hideCopyButton();
        }
    };

    /* Copies the generated text */
    const copyGeneratedText = () => {
        /* Select and copy output text */
        copiableGeneratedText.select();
        document.execCommand('copy');

        /* Add "copied" class to the button */
        copyButton.classList.add('copied');

        /* Remove the "copied" class from the button */
        unsetCopiedState = setTimeout(
            () => {
                copyButton.classList.remove('copied');
            },
            2000
        );
    };

    /* Generate text when trigger button is clicked */
    textGenerationTrigger.addEventListener('click', event => {
        event.preventDefault();
        outputGeneratedText();
    });

    /* Reset the form and output when reset is triggered */
    resetTrigger.addEventListener('click', () => {
        doReset();
        hideResetTrigger();
    });

    /* Copy the generated text when the Copy button is clicked */
    copyButton.addEventListener('click', copyGeneratedText);

    /* Log initialisation message in console */
    console.log(loremPressInitMessage);
};

document.addEventListener('DOMContentLoaded', initiateLoremPress);
