# Generated by Django 4.2.7 on 2023-11-29 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0008_alter_video_likes_alter_video_views'),
    ]

    operations = [
        migrations.CreateModel(
            name='Watchlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('overview', models.TextField()),
                ('first_air_date', models.DateField()),
            ],
        ),
    ]