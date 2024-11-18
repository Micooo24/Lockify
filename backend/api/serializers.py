
from rest_framework import serializers
from .models import User, Role, Passphrase, Account, Password, Analysis
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
import bcrypt
import math
from .analysis import calculate_entropy, remarks, estimate_cracking_time
import os
from django.conf import settings


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role']

class PassphraseSerializer(serializers.ModelSerializer):
    original_passphrase = serializers.SerializerMethodField()

    class Meta:
        model = Passphrase
        fields = ['passphrase', 'original_passphrase']

    def get_original_passphrase(self, obj):
        return getattr(obj, '_original_passphrase', None)


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(required=False)
    passphrase = PassphraseSerializer(source='user_passphrase', read_only=True)  # Updated to use 'user_passphrase'
    
    class Meta:
        model = User
        fields = ['id', 'email', 'fname', 'phone', 'role', 'passphrase', 'image']

    def create(self, validated_data):
        user = super().create(validated_data)
        if hasattr(user, '_original_passphrase'):
            user.passphrase = user._original_passphrase
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.fname = validated_data.get('fname', instance.fname)
        instance.phone = validated_data.get('phone', instance.phone)
        
        # Update role if provided
        role_data = validated_data.get('role')
        if role_data:
            try:
                role = Role.objects.get(role=role_data)
                instance.role = role
            except Role.DoesNotExist:
                raise serializers.ValidationError(f"Role '{role_data}' does not exist.")
        
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(required=False)
    passphrase = PassphraseSerializer(source='user_passphrase', read_only=True)  # Updated to use 'user_passphrase'
    password = serializers.CharField(write_only=True)   # Added password field for password hashing
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'fname', 'phone', 'role', 'passphrase']

    def create(self, validated_data):
        user = super().create(validated_data)
        if hasattr(user, '_original_passphrase'):
            user.passphrase = user._original_passphrase
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    passphrase = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        passphrase = data.get('passphrase')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        # Validate the password using bcrypt
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            raise serializers.ValidationError("Invalid email or password.")

        # Check the passphrase
        if not user.user_passphrase or not bcrypt.checkpw(passphrase.encode('utf-8'), user.user_passphrase.passphrase.encode('utf-8')):
            raise serializers.ValidationError("Invalid passphrase.")

        # Generate tokens for the user if authentication is successful
        refresh = RefreshToken.for_user(user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["user_id"] = user.id
        data["role"] = user.role.role

        return data

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Password
        fields = ['password']

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    password = PasswordSerializer(read_only=True)
    class Meta:
        model = Account
        fields = '__all__'

class PasswordHasher(serializers.ModelSerializer):
    class Meta:
        model = Password
        fields = ['password']

    def validate(self, data):
        # Retrieve the password from the input data
        password = data.get('password')

        # Check if the password is empty before proceeding with hashing
        if not password:
            raise serializers.ValidationError("Password cannot be empty.")
        
        # Return the validated data
        return data

    def hash(self, data, account_id):
        # Extract the password from the data
        password = data.get('password')

        # Check if the password is provided
        if not password:
            raise serializers.ValidationError("Password cannot be empty.")

        # Hash the password using bcrypt
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create a Password instance and associate it with the account_id
        paso = Password(password=hashed_pw, account_id=account_id)

        # Save the Password instance to the database
        paso.save()

        return paso 


class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = ['entropy', 'estimated_cracking_time', 'remarks', 'password_id']
    
    def analyze(self, id, password):
        entropy = calculate_entropy(password)
        cracking_time = estimate_cracking_time(entropy, password)
        states = remarks(password)
        password_id = id
        
        analysis = Analysis(
            entropy=entropy,
            estimated_cracking_time=cracking_time,
            remarks=states,
            password_id=password_id,
        )
        analysis.save()
        
        return analysis

class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['name', 'description', 'username', 'url', 'image']

    def validate(self, data):

        return data

    def createAcc(self, data, id):
       
        name = data['name']
        description = data['description']
        username = data['username']
        Acc_url = data['url']
        
       
        image_file = data['image']
        
    
        if not id:
            return {"error": "User ID is required to create an account."}
        
     
        psw = PasswordHasher()
        lyze = AnalysisSerializer()

        # Create the account instance
        account = Account(
            name=name,
            description=description,
            username=username,
            user_id=id,  # Fixed user ID assignment
            url=Acc_url,
            image=image_file,
        )

        # Check if URL already exists and handle conflict
        existing_account = Account.objects.filter(url=Acc_url).first()
        if existing_account and existing_account.username == username:
            return "An account with this URL and username already exists. Please change your username."

        # Save the account to the database
        account.save()
        
        # Hash the password and perform analysis
        acc_id = account.id
        hashed_password = psw.hash(data['password'], acc_id)
        lyze.analyze(hashed_password.id, data['password'].get('password'))

        return "Account created successfully."



class DeleteAccountSerializer(serializers.ModelSerializer):
    def bura(self, pk):    
        try:
            account = Account.objects.get(id=pk)
            pwd = Password.objects.get(account_id=account.id)
            analysis = Analysis.objects.get(password_id=pwd.id)
            
            if account.image:  # Check if the image exists
                image_path = account.image.path  # Get the full path to the image
                if os.path.isfile(image_path):  # Check if the file exists
                    os.remove(image_path)
            
            # Delete in reverse dependency order
            analysis.delete()
            pwd.delete()
            account.delete()
            
            return "Account deleted successfully."
        except Account.DoesNotExist:
            return "Account not found."
        except Password.DoesNotExist:
            return "Password not found."
        except Analysis.DoesNotExist:
            return "Analysis not found."


class UpdateAccountSerializer(serializers.ModelSerializer):
    def update(self, id, data, password):
        account = Account.objects.get(id=id)
        account.name = data['name']
        account.description = data['description']
        account.username = data['username']
        account.url = data['url']
        account.save()
        
        password = Password.objects.get(account_id=id)
        password.password = bcrypt.hashpw(data['password'].get('password').encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        analysis = Analysis.objects.get(password_id=password.id)
        analysis.entropy = calculate_entropy(data['password'].get('password'))
        analysis.estimated_cracking_time = estimate_cracking_time(analysis.entropy, data['password'].get('password'))
        analysis.remarks = remarks(data['password'].get('password'))
        return "Your account has been updated successfully."
    

class PassPhraseDecoder(serializers.ModelSerializer):
    def decode(self, data):
        # Extract the passphrase and user_id from the data
        passphrase = data.get('passphrase')
        user_id = data.get('user_id')

        # Check if the passphrase is provided
        if not passphrase:
            raise serializers.ValidationError("Passphrase cannot be empty.")
        
        if not user_id:
            raise serializers.ValidationError("User ID is required.")

        try:
            # Retrieve the passphrase stored in the database for the given user_id
            passs = Passphrase.objects.get(user_id=user_id)
            stored_passphrase = passs.passphrase
        except Passphrase.DoesNotExist:
            raise serializers.ValidationError("Passphrase for the given user_id not found.")

        # Compare the provided passphrase with the stored passphrase
        # Use bcrypt's checkpw method to compare the hashes
        if bcrypt.checkpw(passphrase.encode('utf-8'), stored_passphrase.encode('utf-8')):
            return True
        else:
            return False
        

   
    
    