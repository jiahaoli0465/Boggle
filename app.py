from flask import Flask, request, render_template, jsonify, session, redirect
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "fdfgkjtjkkg45yfdb"

boggle_game = Boggle()


@app.route("/play")
def play():
    """Show board."""

    board = boggle_game.make_board()
    session['board'] = board
    base = {'easy': 0, 'hard': 0, 'impossible': 0}
    if 'high_scores' not in session:
        session['high_scores'] = base    

    
    difficulty = session.get('difficulty', 'easy') 
    

    return render_template("index.html", board=board, 
                           
                           difficulty = difficulty)

@app.route("/")
def showhome():
    base = {'easy': 0, 'hard': 0, 'impossible': 0}
    if 'high_scores' not in session:
        session['high_scores'] = base
    return render_template('home.html')


@app.route('/set-difficulty', methods=['POST'])
def setDifficulty():

    difficulty = request.json['difficulty']
    session['difficulty'] = difficulty  # Save difficulty in session

    return redirect('/play')

@app.route('/post-score', methods=['POST'])
def post_score():
    if 'high_scores' not in session:
        session['high_scores'] = {'easy': 0, 'hard': 0, 'impossible': 0}

    scores = session['high_scores']
    data = request.json
    score = int(data.get('score', 0))
    mode = data.get('mode', 'easy')

    if mode not in scores:
        # If the mode is not one of the expected keys, return a 400 error
        return jsonify({'message': 'Invalid difficulty level'}), 400

    if score > scores[mode]:
        scores[mode] = score
        session['high_scores'] = scores
        session.modified = True  # Ensure the session is saved
        return jsonify({'score': score}), 200  # Return the score as JSON

    return '', 200  # Score not higher, but request is OK


@app.route("/word-check")
def check_word():
    """Check if word is in dictionary."""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

                           