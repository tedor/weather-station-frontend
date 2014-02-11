from flask import Flask
from flask.templating import render_template

app = Flask(__name__)


@app.route('/')
def home_page():
    return render_template('home_page.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
