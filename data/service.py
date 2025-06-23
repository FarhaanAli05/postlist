from db_layer import get_connection

def get_tasks():
  db = get_connection()
  cursor = db.cursor(dictionary=True)
  cursor.execute("SELECT * FROM tasks")
  tasks = cursor.fetchall()
  cursor.close()
  db.close()
  return tasks

def add_task(newTask):
  db = get_connection()
  cursor = db.cursor(dictionary=True)
  query = "INSERT INTO tasks (text, finished, description, quantity) VALUES (%s, %s, %s, %s)"
  values = (newTask.get('text'), newTask.get('finished', 'incomplete'), newTask.get('description', ''), newTask.get('quantity', 0))
  cursor.execute(query, values)
  db.commit()
  cursor.execute("SELECT * FROM tasks")
  tasks = cursor.fetchall()
  cursor.close()
  db.close()
  return tasks

def finish_task(index):
  db = get_connection()
  cursor = db.cursor(dictionary=True)
  cursor.execute("SELECT id, finished FROM tasks ORDER BY id ASC LIMIT 1 OFFSET %s", (index,))
  result = cursor.fetchone()
  if result:
    task_id = result['id']
    current_status = result['finished']
    new_status = "complete" if current_status == "incomplete" else "incomplete"
    cursor.execute("UPDATE tasks SET finished = %s WHERE id = %s", (new_status, task_id))
    db.commit()
    cursor.execute("SELECT * FROM tasks ORDER BY id ASC")
    tasks = cursor.fetchall()
    cursor.close()
    db.close()
    return tasks
  cursor.close()
  db.close()
  return None

def edit_task(editTask, index):
  db = get_connection()
  cursor = db.cursor(dictionary=True)
  cursor.execute("SELECT id FROM tasks ORDER BY id ASC LIMIT 1 OFFSET %s", (index,))
  result = cursor.fetchone()
  if result:
    task_id = result['id']
    new_text = editTask[0]
    new_desc = editTask[1] if editTask[1] else ''
    new_qty = editTask[2]

    cursor.execute(
      "UPDATE tasks SET text = %s, description = %s, quantity = %s WHERE id = %s",
      (new_text, new_desc, new_qty, task_id)
    )
    db.commit()

    cursor.execute("SELECT * FROM tasks ORDER BY id ASC")
    tasks = cursor.fetchall()
    cursor.close()
    db.close()
    return tasks
  
  cursor.close()
  db.close()
  return None

def delete_task(index):
  db = get_connection()
  cursor = db.cursor(dictionary=True)
  cursor.execute("SELECT id FROM tasks ORDER BY id ASC LIMIT 1 OFFSET %s", (index,))
  result = cursor.fetchone()
  if result:
    task_id = result['id']
    cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    db.commit()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    cursor.close()
    db.close()
    return tasks
  cursor.close()
  db.close()
  return None