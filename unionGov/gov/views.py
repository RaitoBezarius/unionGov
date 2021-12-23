from hashlib import sha512
from os import path
from pathlib import Path

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


BLACK = (0, 0, 0, 255)
GREEN = (7, 115, 125, 255)
TRANSPARENT = (0, 0, 0, 0)

# Turn a given color in image into RGBA transparency
def color2alpha(image, color=GREEN):
    data = image.getdata()
    new_data = []
    for pixel in data:
        if pixel[0] == color[0] and pixel[1] == color[1] and pixel[2] == color[2]:
            new_data.append(TRANSPARENT)
        else:
            new_data.append(pixel)
    alpha_image = Image.new("RGBA", image.size)
    alpha_image.putdata(new_data)
    return alpha_image


SIZE = 190  # size of a condidate thumbnail

# Resize an image to make it fit in a square
def square(image, size=SIZE, fill_color=BLACK):
    x, y = image.size
    max_size = max(size, x, y)
    squared_image = Image.new("RGBA", (max_size, max_size), fill_color)
    squared_image.paste(image, (int((max_size - x) / 2), int((max_size - y) / 2)))
    return squared_image.resize((size, size), Image.ANTIALIAS)


SEED = 0  # change me to invalidate thumbnail cache

# Given a candidate ID return a profile picture thumbnail path
def get_candidate_thumbnail(candidate_id, size=SIZE, fill_color=BLACK):
    candidate = get_object_or_404(Candidate, pk=candidate_id)
    hash = sha512(f"{candidate.image_file}{SEED}".encode("ASCII")).hexdigest()
    path = Path(f"{settings.MEDIA_ROOT}/thumbnail/candidate/")
    path.mkdir(parents=True, exist_ok=True)
    thumbnail = Path(f"{path}/{hash}.png")
    if not thumbnail.exists():
        original = f"{settings.MEDIA_ROOT}/{candidate.image_file}"
        background = Image.new("RGBA", (size, size), fill_color)
        if candidate.image_file:
            background = square(Image.open(original))
        foreground = square(Image.open(f"{settings.STATIC_ROOT}/thumbnail.png"))
        background.paste(foreground, (0, 0), foreground)
        image = color2alpha(background)
        image.save(thumbnail, "PNG")
    print(thumbnail)
    return thumbnail


# Given a government ID return an image shareable on social media
def generate_gov_thumbnail(request, gov_id):
    hash = sha512(f"{gov_id + SEED}".encode("ASCII")).hexdigest()
    path = Path(f"{settings.MEDIA_ROOT}/thumbnail/gov/")
    path.mkdir(parents=True, exist_ok=True)
    thumbnail = Path(f"{path}/{hash}.png")
    if not thumbnail.exists():
        pos = [
            (350, 190),
            (550, 190),
            (50, 360),
            (250, 360),
            (450, 360),
            (650, 360),
            (850, 360),
            (150, 530),
            (350, 530),
            (550, 530),
            (750, 530),
            (50, 700),
            (250, 700),
            (450, 700),
            (650, 700),
            (850, 700),
        ]
        image = Image.open(f"{settings.STATIC_ROOT}/governement.png")
        background = Image.new("RGBA", image.size, (7, 115, 125, 255))
        for i, gov_member in enumerate(Config.objects.filter(config_ref=gov_id)):
            # TODO: sort gov_member by gov_member.position?
            foreground = Image.open(get_candidate_thumbnail(gov_member.candidate.id))
            background.paste(foreground, pos[i], foreground)
            # TODO: write text gov_member.position at pos[i]?
        background.paste(image, (0, 0), image)
        background.save(thumbnail, "PNG")
    response = HttpResponse(content_type="image/png")
    image = Image.open(thumbnail)
    image.save(response, "PNG")
    return response
