<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use App\Models\Inscripcion;
use App\Models\Integrante;
use App\Models\Jornada;
use App\Models\Partido;
use Illuminate\Http\Request;
use PhpParser\Node\Expr\Instanceof_;

class PartidosController extends Controller
{

    public function getPartido($id, $torneo = null)
    {
        try {
            $parejas = Integrante::where('id_jugador', $id)->select('id_pareja')->get()->pluck('id_pareja');
            $query = Partido::where('estado', 0);
            $query->when(isset($torneo), function ($q) use ($torneo) {
                return $q->where('torneo_id', $torneo);
            });
            $partido = $query
                ->whereIn('p1', $parejas)
                ->orWhereIn('p2', $parejas)
                ->with(
                    'horario',
                    'horario.cancha:id,nombre',
                    'pareja1:id,nombre',
                    'pareja2:id,nombre',
                    'torneo:id,nombre',
                    'jornada:id,numero'
                )->first();
            return response()->json($partido);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error', 'error' => $e->getMessage(),], 500);
        }
    }

    public function getPartidos(Request $request)
    {
        try {
            $parejas = Integrante::where('id_jugador', $request->user)->select('id_pareja')->get()->pluck('id_pareja');
            $partidos = Partido::whereIn('p1', $parejas)->orWhereIn('p2', $parejas)->with(
                'horario',
                'horario.cancha:id,nombre',
                'pareja1:id,nombre',
                'pareja2:id,nombre',
                'torneo:id,nombre',
                'jornada:id,numero'
            )->get();
            return response()->json($partidos);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error', 'error' => $e->getMessage(),], 500);
        }
    }

    public function getJornadasTorneo($torneo)
    {
        $jornadas = Jornada::where('torneo_id', $torneo)->select('id', 'numero')->get();
        return response()->json($jornadas);
    }

    public function getPartidosTorneo(Request $request)
    {
        if (isset($request->jornada)) {
            $partidos = Partido::where('jornada_id', $request->jornada)->with(
                'horario',
                'horario.cancha:id,nombre',
                'pareja1:id,nombre',
                'pareja2:id,nombre',
                'torneo:id,nombre',
                'jornada:id,numero'
            )->get();
        } else {
            $partidos = Partido::where('torneo_id', $request->torneo)->with(
                'horario',
                'horario.cancha:id,nombre',
                'pareja1:id,nombre',
                'pareja2:id,nombre',
                'torneo:id,nombre',
                'jornada:id,numero'
            )->orderBy('jornada_id', 'asc')->get();
        }
        return response()->json($partidos);
    }

    public function getPartidosTorneoPlayer(Request $request)
    {
        if (isset($request->jornada)) {
            $partidos = Partido::where('jornada_id', $request->jornada)->with(
                'horario',
                'horario.cancha:id,nombre',
                'pareja1:id,nombre',
                'pareja2:id,nombre',
                'torneo:id,nombre',
                'jornada:id,numero'
            )->get();
        } else {
            $partidos = Partido::where('torneo_id', $request->torneo)->with(
                'horario',
                'horario.cancha:id,nombre',
                'pareja1:id,nombre',
                'pareja2:id,nombre',
                'torneo:id,nombre',
                'jornada:id,numero'
            )->orderBy('jornada_id', 'asc')->get();
        }

        $parejas = Integrante::where('id_jugador', $request->jugador)->select('id_pareja')->get()->pluck('id_pareja')->toArray();
        $partidos_conflicto = [];
        foreach ($partidos as $partido){
            if(in_array($partido->p1, $parejas) || (in_array($partido->p2, $parejas))){
                $partido->propio = true;
                if($partido->estado == 1){
                    if($partido->pareja_propuesta_resultado != null){
                        $resultado_propuesto = "".$partido->pareja1->nombre." ".$partido->puntos_p1." - ".$partido->puntos_p2." ".$partido->pareja2->nombre;                        
                        $partido->resultado_propuesto = $resultado_propuesto;
                        if(in_array($partido->pareja_propuesta_resultado, $parejas)){
                            $partido->propuesta_externa = false;
                        } else {
                            $partido->propuesta_externa = true;
                        }
                    }
                } else {
                    if($partido->propuesta != null){
                        $horario_propuesto = Horario::find($partido->horario_propuesto)->inicio;
                        $partido->fechor_propuesta = $horario_propuesto;
                        if(in_array($partido->propuesta, $parejas)){
                            $partido->propuesta_externa = false;
                        } else {
                            $partido->propuesta_externa = true;
                        }
                        array_push($partidos_conflicto, $partido);
                    }
                }
            } else {
                $partido->propio = false;
            }
        }
        return response()->json(['partidos'=>$partidos, 'partidos_conflicto'=>$partidos_conflicto], 200);
    }

    public function setHorarioPartido(Request $request)
    {
        $new_horario = Horario::find($request->horario);
        if ($new_horario->ocupado != 0) {
            return response()->json(['message' => 'El nuevo horario no se encuentra disponible'], 400);
        }

        $partido = Partido::find($request->partido);
        if ($partido->horario_id != null) {
            $old_horario = Horario::find($partido->horario_id);
            $old_horario->ocupado = 0;
            $old_horario->save();
        }

        $partido->horario_id = $new_horario->id;
        $partido->save();
        $new_horario->ocupado = 1;
        $new_horario->save();

        return response()->json(['message' => 'Horario asignado con éxito'], 200);
    }
    
    public function proponerHorarioPartido(Request $request)
    {
        $new_horario = Horario::find($request->horario);
        if ($new_horario->ocupado != 0) {
            return response()->json(['message' => 'El nuevo horario no se encuentra disponible'], 400);
        } else {
            $new_horario->ocupado = 1;
            $new_horario->save();
        }
        
        $partido = Partido::find($request->partido);

        if(isset($partido->horario_propuesto)){
            $horario_previo = Horario::find($partido->horario_propuesto);
            $horario_previo->ocupado = 0;
            $horario_previo->save();
        }

        $parejas = Integrante::where('id_jugador', $request->user)->select('id_pareja')->get()->pluck('id_pareja')->toArray();
        $pareja_torneo = Inscripcion::whereIn('pareja_id', $parejas)->where('torneo_id', $partido->torneo_id)->first();
        
        $partido->propuesta = $pareja_torneo->pareja_id;
        $partido->horario_propuesto = $request->horario;
        $partido->save();

        return response()->json(['message' => 'Horario propuesto con éxito'], 200);
    }

    public function aceptarPropuesta($p)
    {
        $partido = Partido::find($p);

        if($partido->horario_id != null){
            $horario_actual = Horario::find($partido->horario_id);
            $horario_actual->ocupado = 0;
            $horario_actual->save();
        }

        $partido->horario_id = $partido->horario_propuesto;
        $partido->propuesta = null;
        $partido->horario_propuesto = null;
        $partido->save();
    }

    public function rechazarPropuesta($p)
    {
        $partido = Partido::find($p);

        $nuevo_horario = Horario::find($partido->horario_propuesto);
        $nuevo_horario->ocupado = 0;
        $nuevo_horario->save();

        $partido->propuesta = null;
        $partido->horario_propuesto = null;
        $partido->save();
    }
    
    public function asignarResultadoPartido(Request $request)
    {

        $partido = Partido::find($request->partido);
        $partido->estado = 2;
        $partido->puntos_p1 = $request->puntos1;
        $partido->puntos_p2 = $request->puntos2;
        $partido->save();

        $this->guardarResultado($partido->p1, $partido->p2, $partido->puntos_p1, $partido->puntos_p2, $partido->torneo_id);

        return response()->json(['message' => 'Resultado asignado con éxito'], 200);
    }
    
    public function proponerResultadoPartido(Request $request)
    {

        $partido = Partido::find($request->partido);

        $partido->estado = 1;
        $partido->puntos_p1 = $request->puntos1;
        $partido->puntos_p2 = $request->puntos2;
        $parejas = Integrante::where('id_jugador', $request->user)->select('id_pareja')->get()->pluck('id_pareja')->toArray();
        $pareja_torneo = Inscripcion::whereIn('pareja_id', $parejas)->where('torneo_id', $partido->torneo_id)->first();
        $partido->pareja_propuesta_resultado = $pareja_torneo->pareja_id;
        $partido->save();

        // $this->guardarResultado($partido->p1, $partido->p2, $partido->puntos_p1, $partido->puntos_p2, $partido->torneo_id);

        return response()->json(['message' => 'Resultado propuesto con éxito'], 200);
    }

    public function guardarResultado($pareja1, $pareja2, $puntos1, $puntos2, $torneo){
        $inscripcion1 = Inscripcion::where('pareja_id', $pareja1)->where('torneo_id', $torneo)->first();
        $inscripcion2 = Inscripcion::where('pareja_id', $pareja2)->where('torneo_id', $torneo)->first();

        if($puntos1 > $puntos2){
            $inscripcion1->p_ganados = $inscripcion1->p_ganados+1;
            $inscripcion2->p_perdidos = $inscripcion2->p_perdidos+1;
        } else {
            $inscripcion2->p_ganados = $inscripcion2->p_ganados+1;
            $inscripcion1->p_perdidos = $inscripcion1->p_perdidos+1;
        }
        $inscripcion1->p_jugados = $inscripcion1->p_jugados+1;
        $inscripcion1->s_ganados = $inscripcion1->s_ganados + $puntos1;
        $inscripcion1->s_perdidos = $inscripcion1->s_perdidos + $puntos2;
        
        $inscripcion2->p_jugados = $inscripcion2->p_jugados+1;
        $inscripcion2->s_ganados = $inscripcion2->s_ganados + $puntos2;
        $inscripcion2->s_perdidos = $inscripcion2->s_perdidos + $puntos1;

        $inscripcion1->update();
        $inscripcion2->update();
    }

    public function aceptarResultado($p)
    {
        $partido = Partido::find($p);

        $partido->pareja_propuesta_resultado = null;
        $partido->estado = 2;
        
        $partido->save();
        
        $this->guardarResultado($partido->p1, $partido->p2, $partido->puntos_p1, $partido->puntos_p2, $partido->torneo_id);
    }

    public function rechazarResultado($p)
    {
        $partido = Partido::find($p);

        $partido->pareja_propuesta_resultado = null;
        $partido->puntos_p1 = 0;
        $partido->puntos_p2 = 0;
        $partido->estado = 0;

        $partido->save();
    }
}
