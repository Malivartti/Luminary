from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    rubles_limit = models.IntegerField()

    def __str__(self):
        return self.name

class User(AbstractUser):
    rubles_used = models.DecimalField(max_digits=15, decimal_places=7, default=0)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username

class Assistant(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    context = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class AIModel(models.Model):
    id_model = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    context = models.IntegerField(default=0)
    input_price = models.DecimalField(max_digits=10, decimal_places=4)
    output_price = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return self.name

class Environment(models.Model):
    name = models.CharField(max_length = 100)
    description = models.CharField(max_length = 256, blank = True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    assistant = models.ForeignKey(Assistant, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def create(self, validated_data):
        user = self.context['request'].user
        # Добавляем пользователя в validated_data
        validated_data['user'] = user
        # Создаем объект Environment
        return Environment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Обновляем поля объекта Environment
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.assistant_id = validated_data.get('assistant_id', instance.assistant_id)  # Предполагается наличие assistant_id
        instance.ai_model_id = validated_data.get('ai_model_id', instance.ai_model_id)      # Предполагается наличие ai_model_id
        instance.save()
        return instance

class CostOfGeneration(models.Model):
    environment = models.ForeignKey(Environment, on_delete=models.CASCADE)
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    input_tokens = models.IntegerField()
    output_tokens = models.IntegerField()
    cost = models.DecimalField(max_digits=15, decimal_places=7)
    created_at = models.DateTimeField(auto_now_add=True)
