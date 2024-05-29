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
    return response