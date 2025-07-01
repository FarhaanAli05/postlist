from django.db import models

# Create your models here.

class Task(models.Model):
    text=models.CharField(max_length=100)
    finished=models.CharField(max_length=100)
    description=models.CharField(max_length=100)
    quantity=models.IntegerField()

    def __str__(self):
        return f"{self.finished}: {self.text} - {self.description}, QTY: {self.quantity}"