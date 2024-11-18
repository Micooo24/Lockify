from django.urls import path
from .views import UserCreateView, UserListView,UserDetailView, LoginView, AccountView, UserDeleteView,  FetchAccountView,DeleteAccountView, UpdateAccountView, FetchSingleAccount,NewAnalysisView
from .views import UserUpdateView, VerifyPassphrase, FetchUserDetails, UpdateUserDetails

from .views  import DisplayAccountView, DisplayAnalysisView, DisplayPassphraseView, DisplayPasswordView

urlpatterns = [
    # userlogin handler ===================================================================================================
    path('users/register', UserCreateView.as_view(), name='user-create'),  # for creating users via POST
    path('users/login', LoginView.as_view(), name='login'),  # for logging in users via POST
    # user===================================================================================================
    path('users/FetchData/<int:pk>', FetchUserDetails.as_view(), name='user-detail'),  
    path('users/UpdateData/<int:pk>', UpdateUserDetails.as_view(), name='user-detail'), 
    # userlogin handler end ===================================================================================================
    
    
    # account handler ===================================================================================================
    path('users/CreateAccount/<int:pk>', AccountView.as_view(), name='account-view'),  
    path('users/FetchAccount/<int:pk>', FetchAccountView.as_view(), name='account-fetch'),
    path('users/DeleteAccount/<int:pk>', DeleteAccountView.as_view(), name='account-Delete'),
    path('users/UpdateAccount/<int:pk>', UpdateAccountView.as_view(), name='account-Update'),
    path('verify-passphrase', VerifyPassphrase.as_view(), name='verify-passphrase'),
    path('users/FetchSingleAccount/<int:pk>', FetchSingleAccount.as_view(), name='single-account-fetch'),
    path('users/CheckNewAnalysis/<int:pk>', NewAnalysisView.as_view(), name='new-analysis-fetch'),
    
    # account handler end ===================================================================================================
    
    
    
    # analysis handler ===================================================================================================
    # path('users/DeleteAccount/<int:pk>', DeleteAccountView.as_view(), name='account-Delete'),
    # analysis handler end ===================================================================================================
    
    
    
    # admin handler ===================================================================================================
    # 
    # 
    # 
    ########## For managing users ===================================================================================================
    path('users/list', UserListView.as_view(), name='user-list'),  # for listing users via GET
    path('users/delete/<int:pk>', UserDeleteView.as_view(), name='user-delete'),  # for deleting a user via DELETE
    path('users/edit/<int:pk>', UserDetailView.as_view(), name='user-detail'),  # New URL for retrieving specific user
     path('users/update/<int:pk>', UserUpdateView.as_view(), name='user-update'),  # New URL for updating specific user
    ########## For managing users end ===================================================================================================
    #
    #
    #
    # admin handler end ===================================================================================================
    
    #display all
    path('users/account/display', DisplayAccountView.as_view(), name='display-account'),  # for listing users via GET
    path('users/analysis/display', DisplayAnalysisView.as_view(), name='display-analysis'),  # for listing users via GET
    path('users/passphrase/display', DisplayPassphraseView.as_view(), name='display-passphrase'),  # for listing users via GET
    path('users/password/display', DisplayPasswordView.as_view(), name='display-password'),  # for listing users via GET
]

