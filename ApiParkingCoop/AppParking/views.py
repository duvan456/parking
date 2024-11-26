from inspect import stack

from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView

from AppParking.serializers import *

# Create your views here.

class ParqueaderoView (viewsets.ModelViewSet):
    queryset = Parqueadero.objects.all()
    serializer_class = ParqueaderoSerializer
class UsuarioView (viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
class TarifaView (viewsets.ModelViewSet):
    queryset = Tarifa.objects.all()
    serializer_class = TarifaSerializer
class PropietarioView (viewsets.ModelViewSet):
    def get_queryset(self):
        an = self.request.query_params.get('an')
        edad = 2024 - int(an)
        queryset = Propietario.objects.filter(edad__gte=edad)
        return queryset
    serializer_class = PropietarioSerializer

class PropietarioByEdad(APIView):
    def post(self,request):
        try:
            data = request.data
            res = Propietario.objects.filter(edad__gte=int(data['edad']))
            respuesta = PropietarioSerializer(res,many=True)
            return Response(respuesta.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"mensaje":"Ocurrio un problema!!"+str(e)}, status=status.HTTP_502_BAD_GATEWAY)

class VehiculoView (viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
class EntradaSalidaView (viewsets.ModelViewSet):
    queryset = EntradaSalida.objects.all()
    serializer_class = EntradaSalidaSerializer
class AuthTokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data =request.data,context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})