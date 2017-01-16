if(window.navigator.userAgent.toLowerCase().match('.net')) {
    window.alert('Your browser is a dinosaur, please use Firefox, Chrome or Safari');
}


/*var sampleData = [
        {
            "q": "What color is the sky?",
            "a": "Blue",
            "image": "https://d2ujflorbtfzji.cloudfront.net/key-image/cce03b4e-e98f-42a3-bd94-1c28e76d4dd0.png"
        },
        {
            "q": "How much wood could a wood chuck chuck?",
            "a": "A lot",
            "image": "https://65.media.tumblr.com/avatar_31019e6091f8_128.png"
        },
        {
            "q": "Who is the king of rock?",
            "a": "Run",
            "image": "https://d1itmove024qgx.cloudfront.net/15cab5d6e16eb3ebec58aba9c4547731ba7f5f97.jpg"
        },
        {
            "q": "What is the answer to everything?",
            "a": "42",
            "image": "https://pbs.twimg.com/profile_images/2561624559/Zaphod2_reasonably_small.jpg"
        },
        {
            "q": "Who defeat Shonuff the Shogun of Harlem?",
            "a": "Bruce Leroy",
            "image": "https://pbs.twimg.com/profile_images/535185211982487552/hZLtbgkj_400x400.jpeg"
        }
    ];

if (!window.localStorage.getItem('flashcards')) {
    window.localStorage.setItem('flashcards', JSON.stringify(sampleData));
}*/

var data = null;
var dataOrder = null;
var counter = 0;
var currentQuestion;
var correctAnswers = [];

function getData() {
    var data = JSON.parse(window.localStorage.getItem('flashcards'));

    return data;
}

function setData(data) {
    var savedData = getData();
    savedData.push(data);
    savedData = JSON.stringify(savedData);
    console.log('saved data:', savedData);
    window.localStorage.setItem('flashcards', savedData);
}

data = getData();
if (data) {
    if (data.length > 1) {
        dataOrder = shuffle(data);
    }
    else {
        showMessage('You need to add a few questions to get started!', 'error');
    }

}
else {
    window.localStorage.setItem('flashcards', '[]');
    data = getData();
}

function saveData() {
    var q = document.querySelector("#questionInput").value;
    var a = document.querySelector("#answerInput").value;
    var image = document.querySelector("#imageInput").value;

    var data = {
        q: q,
        a: a,
        image: image
    };

    setData(data);
}

function shuffle(items) {
    var newOrder = [];
    var usedNumbers = {};
    var i = 0;
    while (newOrder.length < items.length) {
        i++;
        var rando = Math.floor(Math.random() * items.length);
        if (!usedNumbers[rando.toString()]) {
            usedNumbers[rando.toString()] = true;
            newOrder.push(rando);
        }
    }
    return newOrder;
}

function showMessage(text, type) {//students will implement showMessage method
    var msg = document.querySelector("#message");
    msg.innerHTML = text;
    //$(msg).fadeIn('fast').delay(2500).fadeOut('fast');
    $(msg).fadeIn('fast');
    var classNames = 'alert text-center alert-success';

    if (type === 'error') {
        classNames = 'alert text-center alert-danger';
    }

    if (type === 'info') {
        classNames = 'alert text-center alert-info';
    }

    msg.className = classNames;

}

function checkAnswer() {
    var answer = document.querySelector('#answer').value;
    var isCorrect = false;
    if (answer.toLowerCase().trim() === currentQuestion.a.toLowerCase().trim()) {
        showMessage('Correct!', 'success');
        correctAnswers.push(currentQuestion);
        isCorrect = true;
    }
    else {
        showMessage('Wrong, better luck on the next one.', 'error');
    }
    document.querySelector("#cardbox").classList.toggle("flipped");

    if (counter >= data.length) {
        var review = "You answered the last one {{final}}, in all you got {{correct}} of {{total}} correct. Tap the card to play again.";
        var final = isCorrect ? "right" : "wrong";
        review = review.replace('{{final}}', final).replace('{{correct}}', correctAnswers.length).replace('{{total}}', data.length);
        showMessage(review, 'info');

        if (counter > 4 && ! localStorage.getItem('receipt')) {
            var receipt = prompt("Please enter your name to get an extra credit receipt code:");
            receipt = getReceipt(receipt);
            localStorage.setItem('receipt', receipt);
            prompt("copy the code below and send it to your teacher for extra credit:", receipt);
        }

        reset();
    }
}

function getQuestion() {
    var item = data[dataOrder[counter]];
    console.log('Question selected:', item);


    if (item.image) {
        var img = '<img style="float:right; width: 120px; height: 120px;" src="' + item.image + '"/>';

        document.querySelector('#question').innerHTML = item.q + img;
    }
    else {
        document.querySelector('#question').innerHTML = item.q;
    }

    document.querySelector('#answer').value = '';
    currentQuestion = item;
    counter++;
}

function reset() {//only for use afer a game is over
    counter = 0;
    data = getData();
    dataOrder = shuffle(data);
    correctAnswers.splice(0, correctAnswers.length);
    //document.querySelector("#cardbox").classList.toggle("flipped");
}


document.querySelector("#cardback").addEventListener('click', function(e) {
    e.preventDefault();

    document.querySelector('#message').className = 'alert';
    document.querySelector('#message').innerHTML = '&nbsp;';

    if (counter === 0) {
        data = getData();
    }

    if (data.length > 1) {
        if (!dataOrder) {
            dataOrder = shuffle(data);
        }
        document.querySelector("#cardbox").classList.toggle("flipped");
        getQuestion();
    }
    else {
        showMessage('You need to add a few questions to get started!', 'error');
    }
}, false);

document.querySelector("#answerBtn").addEventListener('click', function(e) {
    e.preventDefault();
    checkAnswer();
}, false);

document.querySelector("#saveBtn").addEventListener('click', function(e) {
    e.preventDefault();

    var q = document.querySelector("#questionInput").value;
    var a = document.querySelector("#answerInput").value;

    if (q && a) {
        saveData();
        showMessage('You Q&A has been saved for the next round!', 'success');
    }
    else {
        showMessage('Q & A are required.', 'error');
    }

    document.querySelector("#answerInput").value = '';
    document.querySelector("#questionInput").value = '';
    document.querySelector("#imageInput").value = '';
}, false);

document.querySelector("#quizBtn").addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.toggle('active');
    document.querySelector("#adminBtn").classList.toggle('active');
    document.querySelector('#adminRow').classList.toggle('hide');
    document.querySelector('#quizRow').classList.toggle('hide');
    document.active = null;
}, false);

document.querySelector("#adminBtn").addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.toggle('active');
    document.querySelector("#quizBtn").classList.toggle('active');
    document.querySelector('#quizRow').classList.toggle('hide');
    document.querySelector('#adminRow').classList.toggle('hide');
    document.active = null;
}, false);
