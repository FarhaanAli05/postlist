from flask import request, jsonify
from service import get_tasks, add_task, finish_task, edit_task, delete_task

def register_routes(app):
  @app.route('/tasks', methods=['GET'])
  def get_to_do():
    tasks = get_tasks()
    return jsonify(tasks)

  @app.route('/tasks', methods=['POST'])
  def post_to_do():
    newTask = request.get_json()
    tasks = add_task(newTask)
    return jsonify(tasks)

  @app.route('/tasks/<int:index>', methods=['POST'])
  def post_to_do_finish(index):
    tasks = finish_task(index)
    if tasks is None:
      return jsonify([]), 404
    return jsonify(tasks)

  @app.route('/tasks/edit/<int:index>', methods=['POST'])
  def post_to_do_edit(index):
    editTask = request.get_json()
    tasks = edit_task(editTask, index)
    if tasks is None:
      return jsonify([]), 404
    return jsonify(tasks)

  @app.route('/tasks/<int:index>', methods=['DELETE'])
  def delete_to_do(index):
    tasks = delete_task(index)
    if tasks is None:
      return jsonify([]), 404
    return jsonify(tasks)