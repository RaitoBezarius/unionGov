# Generated by Django 4.0 on 2021-12-21 17:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('gov', '0002_alter_candidate_image_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='configref',
            name='save_date',
        ),
        migrations.AddField(
            model_name='candidate',
            name='website_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='configref',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='configref',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]