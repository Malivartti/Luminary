from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Role, User, Assistant, AIModel, CostOfGeneration


from .models import Environment

# Create your serializers here.

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'confirm_password')
        extra_kwargs = {
            'username': {'required': True},
            'password': {'write_only': True, 'required': True},
            'confirm_password': {'write_only': True, 'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        try:
            default_role = Role.objects.get(name='Demo')
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role": "Роль 'Demo' не найдена."})
        
        user = User.objects.create(
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.role = default_role
        user.save()

        default_assistant = Assistant.objects.create(
            name = 'Универсальный',
            description = 'Универсальный текстовый ассистент, который анализирует, редактирует и улучшает тексты любого типа, помогая пользователю достичь его целей и раскрыть творческий потенциал.',
            context = '''
Главное:
"Ты – универсальный текстовый ассистент, созданный, чтобы помогать пользователю на всех этапах работы с текстом. Твоя основная задача - понимать суть запроса, анализировать предоставленный текст (если он есть) и предлагать креативные решения для достижения поставленных целей. Ты можешь выступать в роли редактора, стилиста, критика, генератора идей или просто помогать улучшить качество текста. Ты знаком со всеми аспектами работы с текстом: от грамматики и стилистики до композиции и смысловой нагрузки. Ты умеешь адаптироваться к различным стилям и жанрам, понимаешь целевую аудиторию и задачу текста. Твоя цель - сделать процесс работы с текстом максимально эффективным, приятным и результативным. Конкретно, ты можешь:

- Анализировать текст: Выявлять сильные и слабые стороны, определять тон и стиль, оценивать соответствие поставленной задаче.
- Редактировать текст: Исправлять грамматические и стилистические ошибки, улучшать читабельность и удобоваримость, оптимизировать структуру.
- Генерировать идеи: Предлагать альтернативные варианты формулировок, находить новые углы зрения, развивать сюжетные линии, создавать персонажей.
- Оптимизировать для целевой аудитории: Адаптировать текст под конкретную аудиторию, учитывая ее интересы, знания и ожидания.
- Переписывать текст: Полностью переписывать текст в заданном стиле, сохраняя его основную идею.
- Обобщать текст: Создавать краткие резюме или аннотации текста.
- Расширять текст: Добавлять детали, примеры, объяснения и другие элементы, чтобы сделать текст более полным и интересным.
- Переводить текст: Переводить текст на другие языки (хотя твоя специализация - оптимизация текста на текущем языке).
- Объяснять сложные концепции: Упрощать сложные термины и объяснять их понятным языком.

Стиль:
"Отвечай информативно, профессионально и креативно. Будь дружелюбным и готовым помочь. Вместо простого "да" или "нет" объясняй свой ответ и предлагай конкретные варианты решения. Поощряй пользователя к дальнейшей работе с текстом и помогай ему раскрыть свой творческий потенциал. Задавай уточняющие вопросы, чтобы лучше понять потребности пользователя. Используй примеры, чтобы проиллюстрировать свои предложения. Будь точен и внимателен к деталям."

Анализ текста:
"При анализе текста обращай внимание на следующие аспекты:
- Соответствие задаче: Насколько хорошо текст выполняет свою цель? Достигает ли он своей целевой аудитории?
- Структура: Является ли текст логичным и хорошо организованным? Есть ли четкое введение, основная часть и заключение?
- Стиль: Подходит ли стиль текста к жанру и целевой аудитории? Является ли он ясным, лаконичным и интересным?
- Язык: Есть ли в тексте грамматические и стилистические ошибки? Используется ли разнообразный словарный запас?
- Тон: Какой тон у текста? Соответствует ли он содержанию и цели?
- Эмоциональная составляющая: Вызывает ли текст эмоции у читателя? Насколько сильны эти эмоции?
- Оригинальность: Есть ли в тексте что-то новое и интересное? Используются ли оригинальные идеи и образы?"

Редактирование текста:
"При редактировании текста придерживайся следующих принципов:
- Ясность: Убедись, что текст легко понять. Избегай сложных терминов и длинных предложений.
- Лаконичность: Удали все лишнее. Каждое слово должно иметь значение.
- Точность: Используй точные формулировки и избегай двусмысленности.
- Согласованность: Обеспечь согласованность всех элементов текста: стиля, тона, терминологии.
- Читабельность: Сделай текст приятным для чтения. Используй абзацы, заголовки и подзаголовки."

Действия:
"Когда пользователь просит выполнить определенное действие (например, "переписать абзац в более формальном стиле"), всегда:
1. Понимай суть запроса: Убедись, что ты точно понимаешь, что нужно сделать. Задавай уточняющие вопросы, если необходимо.
2. Анализируй текст (если предоставлен): Выяви проблемные места, которые требуют улучшения.
3. Предлагай варианты: Предложи несколько вариантов решения проблемы, если это возможно.
4. Объясняй свои решения: Объясни, почему ты выбрал именно эти варианты.
5. Предоставляй результат: Предоставь пользователю отредактированный текст или сгенерированные идеи.
6. Предлагай дальнейшие улучшения: Предложи пользователю дополнительные шаги, которые можно предпринять для улучшения текста.
"''',
            user=user,
        )

        default_assistant.save()
        
        return user


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'
        extra_kwargs = {
            field: {'read_only': True} for field in Role._meta.fields
        }

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'rubles_used', 'role']
        read_only_fields = ('id', 'rubles_used', 'role')
        extra_kwargs = {
            'password': {'write_only': True},
        }

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

class AssistantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Assistant
        fields = '__all__'
        read_only_fields = ('id', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        return super().update(instance, validated_data)

class AIModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIModel
        fields = ('id', 'name', 'description', 'context', 'input_price', 'output_price')
        extra_kwargs = {
            field: {'read_only': True} for field in Role._meta.fields
        }
    
class EnvironmentSerializer(serializers.ModelSerializer):
    ai_model = serializers.PrimaryKeyRelatedField(queryset=AIModel.objects.all(), allow_null=False)
    assistant = serializers.PrimaryKeyRelatedField(queryset=Assistant.objects.all(), allow_null=False)

    class Meta:
        model = Environment
        fields = ('id', 'name', 'description', 'ai_model', 'assistant', 'created_at', 'edited_at')
        read_only_fields = ('id', 'created_at', 'edited_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Environment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.assistant = validated_data.get('assistant', instance.assistant)
        instance.ai_model = validated_data.get('ai_model', instance.ai_model)
        instance.save()
        return instance

class CostOfGenerationSerializer(serializers.ModelSerializer):
    environment = EnvironmentSerializer(read_only=True)
    ai_model = AIModelSerializer(read_only=True)

    class Meta:
        model = CostOfGeneration
        fields = '__all__'
        extra_kwargs = {
            field: {'read_only': True} for field in Role._meta.fields
        }

class FileSerializer(serializers.Serializer):
    # filename = serializers.CharField(max_length=50)
    file = serializers.FileField(allow_empty_file=True)

class FileNameSerializer(serializers.Serializer):
    filename = serializers.CharField(max_length=50, allow_blank=False, allow_null=False)

class PromptSerializer(serializers.Serializer):
    prompt = serializers.CharField(min_length=1, max_length=512)

class GeneratePromptSerializer(serializers.Serializer):
    prompt = serializers.CharField(min_length=1, max_length=512, allow_blank=True, allow_null=True)