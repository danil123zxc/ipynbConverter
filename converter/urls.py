from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotebookFileViewSet, NotebookFileStatusView

router = DefaultRouter()
router.register(r'notebooks', NotebookFileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('conversion-status/<int:pk>/', NotebookFileStatusView.as_view(), name='conversion-status'),
    path('upload/', NotebookFileViewSet.as_view({'post': 'create'}), name='upload-notebook'),
]
