from flask import Flask
from flask.templating import render_template
from api import api_action

app = Flask(__name__)
app.debug = True

@app.route('/api/<action>', methods=['POST', 'GET'])
def api(action):
    return api_action(action)

@app.route('/')
def index():
    return render_template('home_page.html')

if __name__ == '__main__':
    app.run()
