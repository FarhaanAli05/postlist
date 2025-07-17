from django.db import models
from django.conf import settings

# Create your models here.

class Task(models.Model):
    text=models.CharField(max_length=255)
    finished=models.CharField(max_length=255)
    description=models.TextField()
    quantity=models.IntegerField()
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.finished}: {self.text} - {self.description}, QTY: {self.quantity}. User ID: {self.user_id}"
    
class BlogPost(models.Model):
    title=models.CharField(max_length=255)
    author=models.CharField(max_length=100)
    summary=models.TextField()
    content=models.TextField()
    file=models.ImageField(upload_to='images/')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.author} on {self.created_at}. Summary: {self.summary}. Content: {self.content}. File: {self.file}"