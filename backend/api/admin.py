from django.contrib import admin
from .models import User, Role, Assistant, AIModel, Environment, CostOfGeneration

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'role', 'rubles_used', 'is_staff')
    list_display_links = ('username',)
    readonly_fields = ('rubles_used',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'rubles_limit')

@admin.register(Assistant)
class AssistantAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'user')

@admin.register(Environment)
class EnvironmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'ai_model', 'assistant', 'created_at')
    date_hierarchy = 'created_at'

@admin.register(CostOfGeneration)
class CostOfGenerationAdmin(admin.ModelAdmin):
    list_display = ('environment', 'ai_model', 'input_tokens', 'output_tokens', 'cost', 'created_at')
    date_hierarchy = 'created_at'
    readonly_fields = ('environment', 'ai_model', 'input_tokens', 'output_tokens', 'cost', 'created_at')

@admin.register(AIModel)
class AIModelAdmin(admin.ModelAdmin):
    list_display = ('id_model', 'name', 'context', 'input_price', 'output_price')
    list_display_links = ('id_model',)
