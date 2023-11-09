function selectButton(button) {
    // Remove the active class from all buttons
    const buttons = document.querySelectorAll('.selector-button');
    buttons.forEach(btn => {
      btn.classList.remove('active-button');
    });
  
    // Add the active class to the clicked button
    button.classList.add('active-button');
  }
  
  const startButton = document.querySelector('.start-button');

startButton.addEventListener('click', function(e){
    e.preventDefault();
    console.log('hi')

    let gameMode;
    const mode = document.querySelector('.active-button');
    if (mode.classList.contains('easy')){
        gameMode = 'easy';
    }
    if (mode.classList.contains('hard')){
        gameMode = 'hard';
    }
    if (mode.classList.contains('impossible')){
        gameMode = 'impossible';
    }
    console.log(gameMode); // Just for demonstration


      // Post the difficulty to the server
      axios.post('/set-difficulty', { difficulty: gameMode })
      .then(response => {
          window.location.href = '/play';
      })
      .catch(error => {
          console.error('Error posting the difficulty:', error);
      });


});