import datetime
from flask import Flask, request
from gpt4all import GPT4All
from flask_restx import Api, Resource
from context.backend_api_connector import *
#Modelo ideal = all-MiniLM-L6-v2-f16.gguf
#Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf
#gpt4all-falcon-newbpe-q4_0.gguf
#orca-2-7b.Q4_0.gguf = Responde en ingles
#mistral-7b-openorca.gguf2.Q4_0.gguf

"""
#========================Model configurations===========================================
model_name="mistral-7b-openorca.gguf2.Q4_0.gguf"
model = GPT4All(model_name, device="gpu", n_ctx=2048, ngl=28, n_threads=6, verbose=True)
"""


app = Flask(__name__)
api = Api(app, version='1.0', title='ChatBot API', description='API para la gestión de reservas por parte de los usuarios.')



#==========================Controller==============================
#Estructura del body: mensaje, idtorneo, idpartido, idUsuaio
@api.route(f"/api/chat")
class MessageController(Resource):

    @api.doc('chat')
    def post(self):
        """
        Chatea con el chatbot
        """
        data = request.json

        response = handleMessage(data)
        print('Response: ' + str(response))
        return response

        
#========================Funciones de manejo====================================
def handleMessage(data):
    
    result, answer = manage_auto_response(data)
    #if result:
    if isinstance(answer, str):
        print(answer)
        saveMensaje(data['idPartido'], answer)
        return {'message': answer}
    
    
    
    return answer
    #else:

        #with model.chat_session(system_template, prompt_template):
            #response1 = model.generate(question)

        #return #response1
    
    #result, answer = manage_auto_response(message)
    saveMensaje(data['idPartido'], answer)
    return 

def manage_auto_response(data):
    key_words = data['mensaje'].split()

    if key_words[0] == "Disponibilidad":
        return True, str_horarios(get_horarios(data))
    elif key_words[0] == "Reservar":
        return True, str_horarios(book(data))
    elif key_words[0] == "Cancelar":
        return True, cancel(data)

    return False, 0


def get_horarios(data):
    """
    Devuelve un objeto lista en donde cada item es un json de horarios o una string indicando que no hay disponibilidad
    """
    if (check_disponibilidad_format(data['mensaje']) == False):
        return "El formato de la peticion es 'Disponibilidad yyyy-mm-dd' o 'Disponibilidad'"
    
    horarios = get_availability(data['idTorneo'])

    #Si se pidio un dia especifico devolver los horarios de ese dia
    if len(data['mensaje'].split(' ')) == 2:
        horarios_del_dia = []
        for horario in horarios:
            if f"{horario['inicio'].split(' ')[0]}" == data['mensaje'].split(' ')[1]:
                horarios_del_dia.append(horario)

        if len(horarios_del_dia) == 0:
            return "No hay disponibilidad para ese dia"
        return horarios_del_dia
        

    
    return horarios


def check_disponibilidad_format(mensaje):
    words = mensaje.split(' ')
    if len(words) > 2:
        return False
    
    if len(words) == 1:
        return True
    
    if (check_date_format(words[1])) == False:
        return False
    
    return True


def book(data):
    #chequear el formato
    if check_reservar_format(data['mensaje']) == False:
        return "El formato para reservar es 'Reservar yyyy-mm-dd hh:mm'"
    
    #chequear si el partido ya tiene reserva 
    if (isPartidoWithHorario(data['idPartido'])):
        return "El partido ya tiene un horario. Si quieres cambiar el horario debes cancelarlo primero, sabiendo que si incumples la politica de cancelacion debes contactar al organizador."
    key_words = data['mensaje'].split(' ')

    #Obtener la disponibilidad del dia
    data_horarios = {"mensaje": f"Disponibilidad {key_words[1]}", "idTorneo": data['idTorneo']}
    horarios = get_horarios(data_horarios)

    #Obtener el id del horario correspondiente
    if isinstance(horarios, str) or len(horarios) == 0:
        return "No se ha podido reservar porque no hay horarios para ese dia"
    
    id = 0
    for horario in horarios:
        horario_proporcionado = f"{key_words[1]} {key_words[2]}:00.000"
        if horario['inicio'] == horario_proporcionado:
            id = horario['id']

    #Si el id sigue siendo 0 devolver que el horario no esta disponible o no existe y devolver los horarios disponibles
    if id == 0:
        return f"El horario proporcionado para ese dia no existe o no esta disponible. Los horarios disponibles para ese dia son:\n{str_horarios(horarios)}"
    
    #Hacer la reserva
    response = setHorarioPartido(id, data['idPartido'])
    return response['message']

def check_reservar_format(mensaje):
    key_words = mensaje.split(' ')
    
    if len(key_words) != 3:
        return False
    
    if check_date_format(key_words[1]) == False:
        return False
    
    if check_time_format(key_words[2]) == False:
        return False
    
    return True


def cancel(words):
    #Cancela si tienen reserva a esa hora ese dia
    day = words[1]
    time = words[2]

    #get_horario_reservado para el partido
    scheduled_day = "14/04/2024"
    scheduled_time = "10:00"
    

    #Condiciones de cancelacion


    if scheduled_time == time and scheduled_day == day:
        return "Cancelado"

    return "No se pudo cancelar por x"


def check_date_format(date):
    partes = date.split('-')
    if len(partes) != 3:
        return False
    
    anio, mes, dia = partes

    # Verificamos que el año, mes y día tengan la longitud correcta
    if len(anio) != 4 or len(mes) != 2 or len(dia) != 2:
        return False
    try:
        # Intentar convertir la fecha al formato YYYY-mm-dd
        datetime.datetime.strptime(date, '%Y-%m-%d')
        return True
    except ValueError:
        return False
    
def check_time_format(time):
    partes = time.split(':')
    if len(partes) != 2:
        return False
    
    horas, minutos = partes

    # Verificamos que las horas y los minutos tengan la longitud correcta
    if len(horas) != 2 or len(minutos) != 2:
        return False
    try:
        # Intentar convertir la hora al formato HH:mm
        datetime.datetime.strptime(time, '%H:%M')
        return True
    except ValueError:
        return False
    
def str_horarios(horarios):
    if isinstance(horarios, str):
        return horarios
    if 'message' in horarios:
        return horarios
    
    str_horarios = ""
    for horario in horarios:
        str_horarios += f"""{horario['cancha']['nombre']}
{horario['inicio']}

"""
    
    return str_horarios

if __name__ == '__main__':
    str_horarios({'message': 'Horario asignado con éxito'})
    app.run(host='0.0.0.0',port=8080, debug=True)

"""
def question():
    question = request.args.get("question")
    print(question + "Se acabó la pregunta")
    response1 = ''
    result, answer = manage_auto_response(question)

    if result:
        print(answer)
        return answer
    else:
        with model.chat_session(system_template, prompt_template):
            response1 = model.generate(question)

        return response1

def question2(string):
    question = string
    print(question + " Se acabó la pregunta")
    response1 = ''
    result, answer = manage_auto_response(question)
    print()
    if result:
        print("Respuesta:\n" + str(answer))
        return answer
    else:
        with model.chat_session(system_template, prompt_template):
            response1 = model.generate(question)

        return response1
        print(response1 + "eu")
"""