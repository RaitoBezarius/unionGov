# Generated by Django 4.0 on 2022-01-17 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gov', '0004_alter_candidate_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidate',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]