from django.urls import path
from gov.views import CandidateListView, PositionListView

from . import views

urlpatterns = [
    path("", PositionListView.as_view(), name="index"),
    path("perso/", CandidateListView.as_view(), name="persos"),
    path("perso/<int:candidate_id>/", views.candidate, name="detail"),
    path("thumbnail/<int:gov_id>", views.generate_gov_thumbnail, name="gov_thumbnail"),
]
