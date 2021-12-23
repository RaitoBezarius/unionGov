from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.templatetags.static import static
from django.views.generic.list import ListView
from django_filters.rest_framework import DjangoFilterBackend
from PIL import Image
from rest_framework import viewsets
from rest_framework.decorators import action

from .models import Candidate, Config, ConfigRef, Position, User
from .serializers import (
    CandidateSerializer,
    ConfigRefSerializer,
    ConfigSerializer,
    PositionSerializer,
    RichConfigSerializer,
    UserSerializer,
    XConfigSerializer,
)


class CandidateAPIView(viewsets.ReadOnlyModelViewSet):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()


class ConfigAPIView(viewsets.ModelViewSet):
    # Do not enable: delete, neither partial update.
    http_method_names = [
        m
        for m in viewsets.ModelViewSet.http_method_names
        if m not in ("delete", "patch")
    ]
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["config_ref"]

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True
        return super(ConfigAPIView, self).get_serializer(*args, **kwargs)


class RichConfigAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Config.objects.all()
    serializer_class = RichConfigSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["config_ref"]


class XConfigAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Config.objects.all()
    serializer_class = XConfigSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["config_ref__config_ref"]


class ConfigRefAPIView(viewsets.ModelViewSet):
    # Get only a reference
    http_method_names = [
        m for m in viewsets.ModelViewSet.http_method_names if m in ("get", "post")
    ]
    serializer_class = ConfigRefSerializer
    queryset = ConfigRef.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["config_ref"]


class PositionAPIView(viewsets.ReadOnlyModelViewSet):
    serializer_class = PositionSerializer
    queryset = Position.objects.all().order_by("id")


class UserAPIView(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class PositionListView(ListView):
    model = Position
    paginate_by = 20

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)


class CandidateListView(ListView):
    model = Candidate
    paginate_by = 20

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)


def candidate(request, candidate_id):
    candidate = get_object_or_404(Candidate, pk=candidate_id)
    return render(request, "gov/candidate.html", {"candidate": candidate})


def square(image, size, fill_color=(0, 0, 0, 0)):
    x, y = image.size
    max_size = max(size, x, y)
    squared_image = Image.new("RGBA", (max_size, max_size), fill_color)
    squared_image.paste(image, (int((max_size - x) / 2), int((max_size - y) / 2)))
    return squared_image.resize((size, size), Image.ANTIALIAS)


def get_thumbnail(request, candidate_id, size=96):
    candidate = get_object_or_404(Candidate, pk=candidate_id)
    background = square(
        Image.open(f"{settings.MEDIA_ROOT}/{candidate.image_file}"), size
    )
    foreground = square(Image.open(f"{settings.STATIC_ROOT}/thumbnail.png"), size)
    background.paste(foreground, (0, 0), foreground)
    response = HttpResponse(content_type="image/png")
    background.save(response, "PNG")
    return response
