from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

def get_tasks(request):
    tasks = Task.objects.filter(user=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)