<?php

namespace App\Http\Controllers;

use App\Models\Integrante;
use App\Models\Pareja;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Mensaje;
use App\Models\Torneo;
use App\Models\Partido;
use App\Models\Cancelacion;
use App\Models\Horario;
use App\Http\Controllers\TorneoController;

class UserController extends Controller
{

    public function store(Request $request)
    {
        $user = new User();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->tipo = $request->tipo;
        $user->password = "";

        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Usuario añadido correctamente',
        ]);
    }

    public function getUser($email = null)
    {
        isset($email) ?
            $user = User::where('email', $email)->first()
            :
            $user = null;

        if ($user) {
            return response()->json([
                'status' => 200,
                'data' => $user,
            ]);

        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Usuario no encontrado',
            ]);
        }
    }

    public function getJugadores($nombre = null){
        if(isset($nombre)){
            $jugadores = User::where('tipo', 0)->where('name','LIKE','%'.$nombre.'%')->get();
            return $jugadores;
        }else{   
            $jugadores = User::where('tipo', 0)->get();
            return $jugadores;
        }
    }

    public function createPareja(Request $request){
        print_r("Este es el nombre de la pareja: " . $request);
        $pareja = new Pareja();
        $pareja->nombre = $request->nombre;
        $pareja->save();

        foreach($request->jugadores as $jugador){
            $integrante = new Integrante();
            $integrante->id_pareja = $pareja->id;
            $integrante->id_jugador = $jugador;
            $integrante->save();
        }

        return response()->json([
            'status' => 200,
            'message' => 'Pareja e integrantes añadidos correctamente',
        ]);
    }

    public function getParejas($user){
        $id_user = User::where('email', $user)->first()->id;

        $integrantes = Integrante::where('id_jugador', $id_user)->get();

        $parejas = [];

        foreach($integrantes as $integrante){
            $pareja = Pareja::where('id', $integrante->id_pareja)->first();
            array_push($parejas, $pareja);
        }

        return $parejas;
    }
    //Get user by id
    public function getUserById($id) {
        $user = User::where('id', $id)->get();
        return $user;
    }

    //Proporciona los mensajes referentes a un partido. GET
    public function getMensajesPartido($idPartido) {
        $mensajes = Mensaje::where('idPartido', $idPartido)->get();
        return $mensajes;
    }

    //Guardar un mensaje. POST
    public function saveMensaje(Request $request) {
        $mensaje = new Mensaje();
        $mensaje->idPartido = $request->idPartido;
        $mensaje->uidSender = $request->uidSender;
        $mensaje->content = $request->content;
        $mensaje->date = date('Y-m-d H:i');
        $mensaje->save();

        return response()->json([
            'status' => 200,
            'message' => 'Mensaje guardado correctamente',
        ]);
    }

    //Devuelve un entero, el id de la pareja
    public function getParejaIdByUserIdAndPartidoId($idPartido, $uidSender) {
        $parejas_id = Integrante::where('id_jugador', $uidSender)->get()->pluck('id_pareja');
        $partido = Partido::where('id', $idPartido)->first();

        foreach($parejas_id as $pareja_id) {
            if ($pareja_id == $partido->p1 || $pareja_id == $partido->p2) {
                return $pareja_id;
            }
        }

        return "No se encontro";        
    }

    public function isPartidoWithHorario($idPartido) {
        $partido = Partido::where('id', $idPartido)->first();

        if ($partido->horario_id == NULL) {
            return FALSE;
        }

        return TRUE;
    }


    //Obtener cancelaciones relacionadas a un usuario organizador
    public function getCancelaciones($idUser) {

        //obtener torneos organizados por el usuario
        $torneoController = new TorneoController();        
        $response = $torneoController->getTorneosOrganizador($idUser);
        $torneos = json_decode($response->getContent());

        if (empty($torneos)) {return [];}

        foreach ($torneos as $torneo) {
            $torneos_id[] = $torneo->id;
        }
        
        //obtener partidos de esos torneos
        $partidos_id = Partido::whereIn('torneo_id', $torneos_id)->pluck('id');

        //obtener cancelaciones de esos partidos
        if (empty($partidos_id)) {return [];}
        $cancelaciones = Cancelacion::whereIn('idPartido', $partidos_id)->get();

        return $cancelaciones;
    }

    public function cancelWithNoPenalty(Request $request) {
        $partido = Partido::where('id', $request->idPartido)->first(); 
    
        if (!$partido) {
            return response()->json([
                'status' => 404,
                'message' => 'Partido no encontrado',
            ]);
        }
    
        //poner el horario de ocupado a libre
        $horario = Horario::where('id', $partido->horario_id)->first(); 
        if (!$horario) {
            return response()->json([
                'status' => 404,
                'message' => 'Horario no encontrado',
            ]);
        }
    
        $horario->ocupado = 0;
        $horario->save();
    
        //poner el horario del partido a null
        $partido->horario_id = NULL;
        $partido->save();
    
        return response()->json([
            'status' => 200,
            'message' => 'Partido cancelado correctamente',
        ]);
    }
    
    public function saveCancelacion(Request $request) {
        $response = $this->cancelWithNoPenalty($request);
    
        // Verificar si la cancelación fue exitosa
        
        //guardar cancelacion
        $cancelacion = new Cancelacion();
        $cancelacion->idPareja = $request->idPareja;
        $cancelacion->idPartido = $request->idPartido;
        $cancelacion->date = date('Y-m-d H:i'); //modificar como se hizo en los otros metodos para que no de error de conversion
        $cancelacion->estado = $request->estado;
        $cancelacion->save();
    
        return response()->json([
            'status' => 200,
            'message' => 'Cancelacion guardada correctamente',
        ]);
    }
    

    //Modificar el estado de una cancelacion 
    public function updateEstadoCancelacion(Request $request) {
        $cancelaciones = Cancelacion::where('id', $request->id)->get();
        $cancelacion = $cancelaciones[0];
        $cancelacion->estado = $request->estado;
        $cancelacion->save();

        return response()->json([
            'status' => 200,
            'message' => 'Cancelacion actualizada correctamente',
        ]);
    }

    public function getParejaId($uidSender, $idPartido) {
        $integrantes = Integrante::where('id_jugador', $uidSender)->get();

        print($integrantes);

        
        $partido = Partido::where('id', $idPartido)->first();
        $idPareja = 0;
        foreach ($integrantes as $integrante) {
            print($integrante->id_pareja);
            if ($integrante->id_pareja == $partido->p1 or $partido->p2) {
                $idPareja = $integrante->id_pareja;
            }
        }

        return response()->json([
            'idPareja' => $idPareja 
        ]);
    }

}
