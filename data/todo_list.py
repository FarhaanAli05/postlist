from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [{'text': "Go to the gym", 'finished': "incomplete", 'description': '', 'quantity': 0}, {'text': "Have breakfast", 'finished': "incomplete", 'description': '', 'quantity': 0}, {'text': "Begin homework", 'finished': "incomplete", 'description': '', 'quantity': 0}]

@app.route('/tasks', methods=['GET'])
def get_to_do():
  return tasks

@app.route('/tasks', methods=['POST'])
def post_to_do():
  newTask = request.get_json()
  tasks.append(newTask)
  return tasks

@app.route('/tasks/<int:index>', methods=['POST'])
def post_to_do_finish(index):
  if tasks[index]['finished'] == 'complete':
    tasks[index]['finished'] = 'incomplete'
  elif tasks[index]['finished'] == 'incomplete':
    tasks[index]['finished'] = 'complete'
  return tasks

@app.route('/tasks/edit/<int:index>', methods=['POST'])
def post_to_do_edit(index):
  editTask = request.get_json()
  if editTask[1]:
    tasks[index] = {'text': editTask[0], 'finished': 'incomplete', 'description': editTask[1], 'quantity': editTask[2]}
  else:
    tasks[index] = {'text': editTask[0], 'finished': 'incomplete', 'description': '', 'quantity': editTask[2]}
  return tasks

@app.route('/tasks/<int:index>', methods=['DELETE'])
def delete_to_do(index):
  return tasks.pop(index)

if __name__ == "__main__":
  app.run(debug=True)