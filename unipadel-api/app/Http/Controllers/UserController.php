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
            'message' => 'Pareja e integrantes añadidos correctamente',
        ]);
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

    //Guardar una cancelacion
    public function saveCancelacion(Request $request) {
        $cancelacion = new Cancelacion();
        $cancelacion->idPareja = $request->idPareja;
        $cancelacion->idPartido = $request->idPartido;
        $cancelacion->date = date('Y-m-d H:i');
        $cancelacion->estado = $request->estado;
        $cancelacion->save();

        return response()->json([
            'status' => 200,
            'message' => 'Pareja e integrantes añadidos correctamente',
        ]);
    }

    //PROBAR
    //Modificar el estado de una cancelacion 
    public function updateEstadoCancelacion(Request $request) {
        $cancelacion = Cancelacion::where('id', $request->id)->first();
        $cancelacion->estado = $request->estado;
        $cancelacion->update();

        return response()->json([
            'status' => 200,
            'message' => 'Pareja e integrantes añadidos correctamente',
        ]);
    }

}
