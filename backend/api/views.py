

# Description: Views for the users app.

from rest_framework import generics
from .models import User, Role, Account, Passphrase, Password, Analysis
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, CreateAccountSerializer, PasswordHasher, AccountSerializer, DeleteAccountSerializer, UpdateAccountSerializer, PassPhraseDecoder, AccountSerializer, PasswordSerializer, AnalysisSerializer, AnalysisSerializer, PassphraseSerializer
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
import bcrypt

# for login process
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .analysis import calculate_entropy, remarks, estimate_cracking_time

# register/create user
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # Assign 'user' role by default
        role, created = Role.objects.get_or_create(role='user')
        user = serializer.save(role=role)
        
        # Fetch the original passphrase generated for this user
        original_passphrase = getattr(user, '_original_passphrase', None)
        
        # Send passphrase as part of the response
        return Response({
            "user": UserSerializer(user).data,
            "passphrase": original_passphrase  # Include original passphrase here
        }, status=status.HTTP_201_CREATED)

# read/display user
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
# Retrieve specific user by ID
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# update user
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
        
# delete user
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # Log the validated email, as mentioned in your debug message
            print(f"[DEBUG] Login data validated for email: {serializer.validated_data['email']}")
            # Return a Response with the validated data
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        # Return a Response with errors if validation fails
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# for creating existing accounts of the current user
class AccountView(generics.ListAPIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, pk, format=None):
        serializer = CreateAccountSerializer(data=request.data)
        serializer2 = PasswordHasher(data=request.data)
        user_id = pk
        if serializer.is_valid() and serializer2.is_valid():
            data = serializer.validated_data
            password = serializer2.validated_data
            data['password'] = password

            if not user_id:
                return Response({"User doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
            
            result = serializer.createAcc(data, pk)
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "No accounts found for the user."}, status=status.HTTP_400_BAD_REQUEST)

class FetchAccountView(generics.ListAPIView):
    def get(self, request, pk):
        # user_data = self.request.data
        user_id = pk 

        if user_id is not None:
        
            accounts = Account.objects.filter(user_id=user_id).prefetch_related('passwords')

            if accounts.exists():
                all_account_data = []

                for account in accounts:
                    
                    account_data = AccountSerializer(account).data

                    passwords = account.passwords.all().values('id', 'password')
                    account_data['passwords'] = list(passwords)

                    # Append to the list of all accounts
                    all_account_data.append(account_data)

                # Return the data for all accounts
                return Response(all_account_data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "No accounts found for the given user ID."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "User ID not provided."}, status=status.HTTP_400_BAD_REQUEST)
        
class DeleteAccountView(APIView):
    def delete(self, request, pk, *args, **kwargs):
        # Create a serializer instance and call the bura method
        serializer = DeleteAccountSerializer()
        result = serializer.bura(pk)
        return Response({"message": result}, status=status.HTTP_200_OK)
    
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Account  # Replace with the actual path to your Account model

class UpdateAccountView(APIView):
    def put(self, request, pk, *args, **kwargs):
        try:
            # Get the account by ID
            account = Account.objects.get(id=pk)

            # Check if there are changes
            name = request.data.get('name')
            description = request.data.get('description')
            username = request.data.get('username')

            if (
                name == account.name and
                description == account.description and
                username == account.username
            ):
                return Response({"message": "No changes made."}, status=status.HTTP_200_OK)

            # Update the fields with new values
            account.name = name
            account.description = description
            account.username = username
            account.save()  # Save the changes to the database

            return Response({"message": "Account updated successfully."}, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

       
    
class VerifyPassphrase(APIView):
    def post(self, request, *args, **kwargs):
        # Extract the passphrase from the request body
        passphrase = request.data.get('passphrase', '')  # Get 'passphrase' from the posted data
        
        print("Received passphrase:", passphrase)  # Print to check the data being passed
        serializer = PassPhraseDecoder()
       
        if serializer.decode(data=request.data):  # Replace with actual verification logic
            return Response({'success': True, 'message': 'Passphrase is valid.'}, status=status.HTTP_200_OK)
        else:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

class RenderAccountView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "This is the account view."}, status=status.HTTP_200_OK)
    

class FetchSingleAccount(APIView):
    def get(self, request, pk):
        account = Account.objects.get(id=pk)
        psw_id = account.id
        psw = Password.objects.get(account_id=psw_id)
        ana_id = psw.id
        analysis = Analysis.objects.get(password_id=ana_id)
        
        account_data = AccountSerializer(account).data
        password_data = PasswordSerializer(psw).data
        analysis_data = AnalysisSerializer(analysis).data
        
        if not account:
            return Response({"detail": "No account found for the given account ID."}, status=status.HTTP_404_NOT_FOUND)
        if not psw:
            return Response({"detail": "No password found for the given account ID."}, status=status.HTTP_404_NOT_FOUND)
        if not analysis:
            return Response({"detail": "No analysis found for the given password ID."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"account": account_data, "password": password_data, "analysis": analysis_data}, status=status.HTTP_200_OK)
    
class NewAnalysisView(APIView):
    def put(self, request, pk):
        unhashed = request.data.get('password')
        
        if not unhashed:
            return Response({"detail": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
        
   
        try:
            account = Account.objects.get(id=pk)
            psw = Password.objects.get(account_id=account.id)
            analysis = Analysis.objects.get(password_id=psw.id)
        except (Account.DoesNotExist, Password.DoesNotExist, Analysis.DoesNotExist):
            return Response({"detail": "Account, password, or analysis not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if bcrypt.checkpw(unhashed.encode('utf-8'), psw.password.encode('utf-8')):
            return Response({"detail": "This is the same as your old password!"}, status=status.HTTP_400_BAD_REQUEST)
        
        hashed_pw = bcrypt.hashpw(unhashed.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        psw.password = hashed_pw
        
        entropy = calculate_entropy(unhashed)
        cracking_time = estimate_cracking_time(entropy, unhashed)
        states = remarks(unhashed)
        
        analysis.entropy = entropy
        analysis.estimated_cracking_time = cracking_time
        analysis.remarks = states
        analysis.save()

        psw.save()

        analysis_data = AnalysisSerializer(analysis).data
        return Response({"detail":"Success!","analysis": analysis_data}, status=status.HTTP_200_OK)
    

class FetchUserDetails(APIView):
    def get(self, request, pk):
        user = User.objects.get(id=pk)
        user_data = UserSerializer(user).data
      
        if not user:
            return Response({"detail": "No user found for the given user ID."}, status=status.HTTP_404_NOT_FOUND)
       
        
        return Response({"user": user_data}, status=status.HTTP_200_OK)
                
import os
from django.conf import settings

import os
from django.conf import settings

class UpdateUserDetails(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, pk):
        user = User.objects.get(id=pk)
        new_fname = request.data.get('fname')
        new_email = request.data.get('email')
        new_phone = request.data.get('phone')
        new_password = request.data.get('password')
        new_image = request.data.get('image', None)  # Use .get() to avoid KeyError
        
        # Check if no data has changed
        if not new_email and not new_fname and not new_image and not new_phone:
            return Response({"detail": "No changes made."}, status=status.HTTP_400_BAD_REQUEST)

        # If a new email is provided, update it
        if new_email:
            user.email = new_email
        
        # If a new password is provided, hash it and update it
        if new_password:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.password = hashed_password 
            
        if new_fname:
            user.fname = new_fname
        
        if new_phone:
            user.phone = new_phone
        
        # If a new image is provided, delete the old one only if it's not a default image
        if new_image and new_image != 'account/default.jpg':  # Add condition to check for default image
            old_image = user.image  # The old image path

            # Check if the old image exists
            if old_image:
                old_image_path = old_image.path if hasattr(old_image, 'path') else None
                
                # If the old image exists and the path is valid, delete it
                if old_image_path and os.path.exists(old_image_path):
                    os.remove(old_image_path)

            # Save the new image path
            user.image = new_image

        # Save the updated user record
        user.save()

        return Response({"detail": "User updated successfully."}, status=status.HTTP_200_OK)


# get account
class DisplayAccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

# get analysis
class DisplayAnalysisView(generics.ListAPIView):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
# get passphrase
class DisplayPassphraseView(generics.ListAPIView):
    queryset = Passphrase.objects.all()
    serializer_class = PassphraseSerializer
    
# get password
class DisplayPasswordView(generics.ListAPIView):
    queryset = Password.objects.all()
    serializer_class = PasswordSerializer


            