from django.db import models
from django.utils.crypto import get_random_string
from django.utils import timezone

from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

from datetime import timedelta

# Delay before a governement is frozen.
GRACE_PERIOD_BETWEEN_FREEZE = 10


def get_new_ref():
    """ Generate a new config ref """
    return get_random_string(length=32)


# Create your models here.
class User(models.Model):
    email_address = models.EmailField()
    first_name = models.CharField(max_length=32, default="")
    last_name = models.CharField(max_length=32, default="")


class ConfigRef(models.Model):
    # long enough random string, to be set at generation
    config_ref = models.CharField(max_length=32, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.PROTECT)

    def __str__(self) -> str:
        return "{}, created: {}, updated: {}".format(self.config_ref, self.created_at, self.updated_at)

    def save(self, *args, **kwargs):
        if not self.config_ref:
            self.config_ref = get_new_ref()

        super(ConfigRef, self).save(*args, **kwargs)


class Candidate(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    image_file = models.ImageField(upload_to='img', blank=True, null=True)
    image_url = models.CharField(null=True, blank=True, max_length=255)
    website_url = models.URLField(null=True, blank=True)

    def __str__(self) -> str:
        return "{} {}".format(self.first_name, self.last_name)

    def save(self, *args, **kwargs):
        if self.image_url is None:
            self.image_url = self.image_file.url
        super().save(*args, **kwargs)


class Position(models.Model):
    position_name = models.CharField(max_length=128)

    def __str__(self) -> str:
        return self.position_name


class Config(models.Model):
    config_ref = models.ForeignKey(ConfigRef, on_delete=models.PROTECT)
    position = models.ForeignKey(Position, on_delete=models.PROTECT)
    candidate = models.ForeignKey(Candidate, on_delete=models.PROTECT)

    def __str__(self) -> str:
        return "Config {}: {} pour {}".format(self.config_ref, self.candidate, self.position)


@receiver(post_save, sender=Config)
def update_date_field_for_ref(sender, instance, **kwargs):
    current_config_ref = instance.config_ref

    ConfigRef.objects.filter(config_ref=current_config_ref).update(updated_at=timezone.now())

    return True

@receiver(pre_save, sender=Config)
def check_config(sender, instance, **kwargs):
    """ Returns True if both Position and Candidate are new, for this configRef

    If not True raises a custom exception
    """
    current_id = instance.id
    current_config_ref = instance.config_ref
    current_candidate = instance.candidate
    current_position = instance.position

    if current_config_ref.updated_at - timezone.now() > timedelta(minutes=GRACE_PERIOD_BETWEEN_FREEZE):
        raise ValidationError("Frozen government, cannot modify")

    # Get existing Config rows
    existing_rows = Config.objects.filter(config_ref=current_config_ref)

    # Check distinct from values in instance
    for row in existing_rows:
        if (row.candidate.id == current_candidate.id):
            if (row.id != current_id):
                raise ValidationError("Duplicate candidate in Config")

        if (row.position.id == current_position.id):
            if (row.id != current_id):
                raise ValidationError("Duplicate position in Config")

    return True
