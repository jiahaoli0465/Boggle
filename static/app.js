const form = document.querySelector('#wordForm')
const wordInput = document.querySelector('.word');
const wordlist = document.querySelector('.words');
// const score = document.querySelector('.score');
const boggle = document.getElementById('boggle');
const timer = document.querySelector('.timer');
const secondsLeft = document.querySelector('#secondsLeft');
const message = document.querySelector('#message');

const difficulty = boggle.getAttribute('data-difficulty');

console.log(difficulty)


let time;

if (difficulty){
    if (difficulty) {
        if (difficulty == 'easy') {
            time = 90;
        } 
        if (difficulty == 'hard') {
            time = 60;
        }
        if (difficulty == 'impossible'){
            time = 30;
        }
    } else {
        time = 90;
    }
}
timer.innerText = time;






class Boggle {
    constructor(boardId, secs = time) {
        // this.secs = time; // game length
        this.secs = time;
        this.startCountdown();
        this.end = false;
    
        this.score = document.querySelector('.score');
        this.score.innerText = 0;
        this.foundWords = new Set();

        this.form = document.querySelector('#wordForm');
        this.form.addEventListener('submit', this.wordFunc.bind(this));


    
 
    
      }

      startCountdown() {
        let counter = 3;
        secondsLeft.innerHTML = 'Starts in: <b class="timer"></b>';
        const theTime = document.querySelector('.timer');

      
        const intervalId = setInterval(() => {
          theTime.innerText = counter;
          counter--;
      
          if (counter < 0) {
            clearInterval(intervalId); // Stop the countdown
            secondsLeft.innerHTML = 'Seconds Left: <b class="timer"></b>';
            const theTime = document.querySelector('.timer');


            theTime.innerText = this.secs;
            this.countDown();
          }
        }, 1000); 
      }

      countDown() {
        const theTime = document.querySelector('.timer');
      
        const cntDown = setInterval(() => {
          theTime.innerText = this.secs;
          this.secs--;
      
          if (this.secs < 0) {
            clearInterval(cntDown);
            this.endGame();
          }
        }, 1000);
      }

      endGame () {
        console.log('ended');
        message.innerText = '';


        this.end = true;
        const homeButton = document.createElement('button');
        homeButton.textContent = 'Home';
        homeButton.classList.add('home-button-class');
        const homeMessage = document.createElement('p');
        homeMessage.classList.add('homeMessage');
        homeMessage.innerText = 'Game has ended, take me back ';
        message.appendChild(homeMessage);
        message.appendChild(homeButton);

        const modeDifficulty = boggle.getAttribute('data-difficulty');
        const endScore = parseInt(this.score.innerText)
        axios.post('/post-score', { mode: modeDifficulty, score: endScore })
        .then(response => {
            // Handle the response here
            console.log('Score submitted successfully:', response.data);
            const highScore = document.querySelector('#highScore');
            // if (parseInt(this.score.innerText) > parseInt)
            if (response.data){
               highScore.innerHTML = response.data.score;  
            }
            

          })
          .catch(error => {
            // Handle errors here
            console.error('Error submitting score:', error);
          });

        homeButton.addEventListener('click', () => {
            window.location.href = '/'; // Example: Navigate to the home page
        });

      }

      async wordFunc (e) {
        let foundWords = this.foundWords;
        e.preventDefault();
        if (this.end){
            return;
        }


        let word = wordInput.value;
        if (word.length < 3) {
            console.log('word must be at least 3 letters')
            message.innerText = `A word must be at least 3 letters`;
    
            return;
        }
    
    
        wordInput.value = '';
    
        if (foundWords.has(word)) {
            console.log('Word already found');
            message.innerText = `${word} has already been found`;
            
            return;
        }
        const resp = await axios.get("/word-check", { params: { word: word }});
    
        if (resp.data.result === "not-word") {

            message.innerText = `${word} is not a valid english word`;
            return;
        } 
        if (resp.data.result === "not-on-board") {

            message.innerText = `${word} is not on this board`;
            return;
          } else {
            let appendWord = document.createElement('li');
            appendWord.innerText = word;
            wordlist.appendChild(appendWord);
            foundWords.add(word);
            this.score.innerText = parseInt(this.score.innerText) + 1;
    
    
          }
    
    }

}



let boggleGame = new Boggle();
