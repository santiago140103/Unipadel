import requests

base_url = "http://127.0.0.1:8000/api/"
chatBot_uid = 10002


def get_availability(id):
    """
    Obtiene los horarios disponibles del torneo. Requiere el id del torneo para hacer la peticion
    """
    url = f"{base_url}getHorariosDisponibles/{id}"
    response = requests.get(url)
    return response.json()

def setHorarioPartido(id_horario, id_partido):
    """
    Asigna un horario a un partido. Requiere el id del horario y del partido
    """

    url = f"{base_url}setHorarioPartido"
    data = {"horario": id_horario, "partido": id_partido}
    response = requests.post(url, data)
    return response.json()

def saveMensaje(id_partido:int, content:str):
    """
    Guarda el mensaje del chatbot en la base de datos
    """
    url = f"{base_url}saveMensaje"
    data = {'uidSender': chatBot_uid, 'idPartido': id_partido, 'content': content}
    response = requests.post(url, data)
    return response.json()

def isPartidoWithHorario(idPartido:int):
    url = f"{base_url}isPartidoWithHorario/{idPartido}"
    response = requests.get(url)

    #0 false, 1 true
    if response.json()['is'] == 1:
        return True
    return False

def getHorarioPartido(idPartido: int):
    url = f"{base_url}getHorarioPartido/{idPartido}"
    response = requests.get(url)
    return response.json()

def getTorneo(idTorneo: int):
    url = f"{base_url}getTorneo/{idTorneo}"
    response = requests.get(url)
    return response.json()

def saveCancelacion(id_partido:int, id_pareja):
    url = f"{base_url}saveCancelacion"
    data = {'idPareja': id_pareja, 'idPartido': id_partido}
    response = requests.post(url, data)
    return response.json()

#Falta probar
def cancelWithNoPenalty(id_partido:int):
    url = f"{base_url}cancelWithNoPenalty"
    data = {'idPartido': id_partido}
    response = requests.post(url, data)
    return response.json()

#Falta implementar
def getParejaId(uidSender:int, idPartido:int):
    url = f"{base_url}getParejaId/{uidSender}/{idPartido}"
    response = requests.get(url)
    print('Response del back: ')
    print(response)
    return response.json()