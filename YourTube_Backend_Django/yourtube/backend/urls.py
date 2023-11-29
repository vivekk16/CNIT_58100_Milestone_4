from django.contrib import admin
from django.urls import path
from backend.views.user import CreateUser, DestroyUser, LoginUserView, RetrieveUser, UpdateUser
from backend.views.video import ListVideos, RetrieveVideo, CreateVideo
from backend.views.watchlist import ListWatchlist, AddToWatchlist, DeleteFromWatchlist


urlpatterns = [
    path('user/create', CreateUser.as_view()),
    path('user/login', LoginUserView.as_view()),
    path('user/<str:email>', RetrieveUser.as_view()),
    path('user/update/<str:email>', UpdateUser.as_view()),
    path('user/delete/<int:pk>', DestroyUser.as_view()),
    path('videos', ListVideos.as_view()),
    path('video/<int:pk>', RetrieveVideo.as_view()),
    path('video/create', CreateVideo.as_view()),
    path('watchlist', ListWatchlist.as_view()),
    path('watchlist/add', AddToWatchlist.as_view()),
    path('watchlist/delete/<int:pk>', DeleteFromWatchlist.as_view())
]