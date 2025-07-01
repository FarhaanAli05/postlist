from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

def get_tasks():
    tasks = Task.objects.all().values()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)