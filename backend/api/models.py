from django.db import models
from django.conf import settings

# Create your models here.

class Task(models.Model):
    text=models.CharField(max_length=100)
    finished=models.CharField(max_length=100)
    description=models.CharField(max_length=100)
    quantity=models.IntegerField()
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.finished}: {self.text} - {self.description}, QTY: {self.quantity}. User ID: {self.user_id}"