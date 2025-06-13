from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [{'text': "Go to the gym", 'finished': "incomplete"}, {'text': "Have breakfast", 'finished': "incomplete"}, {'text': "Begin homework", 'finished': "incomplete"}]

@app.route('/', methods=['GET'])
def get_to_do():
  return tasks

@app.route('/', methods=['POST'])
def post_to_do():
  newTask = request.json()
  tasks.append(newTask)
  return tasks

if __name__ == "__main__":
  app.run(debug=True)