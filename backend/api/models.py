
from django.db import models
from django.contrib.auth.hashers import make_password
import random
import string
from django.core.exceptions import ValidationError
import hashlib
import bcrypt
from django.utils.translation import gettext_lazy as _


def upload_to_profile(instance, filename):
    return 'profile/{filename}'.format(filename=filename)
def upload_to_account(instance, filename):
    return 'account/{filename}'.format(filename=filename)

class Role(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.role

class Passphrase(models.Model):
    user = models.OneToOneField('User', related_name='user_passphrase', on_delete=models.CASCADE)
    passphrase = models.CharField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Only generate a passphrase if it is not already set
        if not self.passphrase:
            original_passphrase = self.generate_passphrase()
            self.passphrase = bcrypt.hashpw(original_passphrase.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            self._original_passphrase = original_passphrase
        super().save(*args, **kwargs)

    def generate_passphrase(self):
        # Generate a random 4-word passphrase from a fixed list of words
        fixed_words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew']
        words = random.sample(fixed_words, 4)
        return ' '.join(words)

    def __str__(self):
        return self.passphrase

class User(models.Model):
    email = models.EmailField(unique=True)
    fname = models.CharField(max_length=100)
    password = models.CharField(max_length=255)  # Store hashed passwords
    phone = models.CharField(max_length=15)
    image = models.ImageField(
        _('image'),
        upload_to=upload_to_profile, 
        null=True, 
        blank=True, 
        default='profile/default.jpg'  # Default image path
    )
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, related_name='users')

    def save(self, *args, **kwargs):
        # Hash the password using bcrypt if it isn't hashed
        if not self.password.startswith("$2b$"):
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Assign default 'user' role if not set
        if self.role is None:
            self.role, created = Role.objects.get_or_create(role='user')

        # Save the user object first to ensure it has a primary key
        super().save(*args, **kwargs)

        # Now create a Passphrase related to the user if it doesn't already exist
        if not hasattr(self, 'user_passphrase'):
            passphrase_instance = Passphrase.objects.create(user=self)  # Automatically generates a 4-word passphrase
            self._original_passphrase = passphrase_instance._original_passphrase

    def __str__(self):
        return self.email
            
class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    url = models.CharField(max_length=255, default='example.com')
    image = models.ImageField(
        _('image'),
        upload_to=upload_to_account, 
        null=True, 
        blank=True, 
        default='account/default.jpg'  # Default image path
    )
    def __str__(self):
        return self

class Password(models.Model):
    password = models.CharField(max_length=255)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='passwords')
   
    
    def __str__(self):
        return self

class Analysis(models.Model):
    password = models.OneToOneField(Password, on_delete=models.CASCADE, related_name='passwords')
    entropy = models.FloatField(null=True, blank=True)
    estimated_cracking_time = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.CharField(max_length=255)

    def __str__(self):
        return self.remarks