<?php

namespace App\Http\Controllers;

use App\Models\Cancha;
use App\Models\Horario;
use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Models\User;
use App\Models\Inscripcion;
use App\Models\Pareja;
use App\Models\Integrante;
use App\Models\Jornada;
use App\Models\Partido;
use App\Models\PreferenciaInscripcion;
use Carbon\Carbon;

class TorneoController extends Controller
{
    public function getTorneo($id = null)
    {
        if (isset($id)) {
            $torneo = Torneo::where('id', $id)->first();
        } else {
            $torneo = Torneo::all();
        }
        return response()->json($torneo);
    }

    public function getTorneosOrganizador($organizador, $estado = null)
    {
        $torneos = Torneo::where('organizador_id', $organizador);
        if (isset($estado)) {
            $torneos = $torneos->where('estado', $estado);
        }
        return response()->json($torneos->get());
    }

    public function getTorneosJugador($jugador)
    {
        $parejas = Integrante::where('id_jugador', $jugador)->select('id_pareja')->get()->pluck('id_pareja')->toArray();
        $inscripciones = Inscripcion::whereIn('pareja_id', $parejas)->get()->pluck('torneo_id')->toArray();
        $torneos = Torneo::where('estado', 1)->whereIn('id', $inscripciones)->get();
        return response()->json($torneos);
    }

    public function store(Request $request)
    {
        $organizador_id = User::where('email', $request->organizador)->first()->id;

        $torneo = new Torneo();
        $torneo->nombre = $request->nombre;
        $torneo->fecha_inicio = $request->fecha_inicio;
        $torneo->fecha_fin = $request->fecha_fin;
        $torneo->fecha_limite = $request->fecha_limite;
        $torneo->formato = $request->formato;
        $torneo->ciudad = $request->ciudad;
        $torneo->club = $request->club;
        $torneo->max_parejas = $request->max_jugadores;
        $torneo->precio = $request->precio;
        $torneo->descripcion = $request->descripcion;
        // $torneo->estado = $request->activo;
        $torneo->organizador_id = $organizador_id;

        if ($torneo->save()) {
            return response()->json([
                'status' => 200,
                'message' => 'Torneo creado correctamente',
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'No se ha podido crear el torneo',
            ]);
        }
    }

    public function inscripcion(Request $request)
    {
        try {
            $torneo = Torneo::findOrFail($request->torneo);

            $valid = $this->checkInscripcion($request->pareja, $torneo->id);
            if (!$valid) {
                return response()->json(['message' => 'Esto se debe a que, o bien la pareja, o uno de sus integrantes, ya se encuentran inscritos en la competición'], 500);
            }

            if (Inscripcion::where('pareja_id', $request->pareja)->where('torneo_id', $torneo->id)->first() != null) {
                return response()->json(['message' => 'Ya existe una inscripción de la pareja para este torneo'], 500);
            }

            $num_inscripciones = Inscripcion::where('torneo_id', $torneo->id)->count();

            if ($torneo->max_parejas > $num_inscripciones) {
                $inscripcion = new Inscripcion();
                $inscripcion->pareja_id = $request->pareja;
                $inscripcion->torneo_id = $torneo->id;
                $inscripcion->save();

                foreach ($request->horarios as $horario) {

                    $preferencias = new PreferenciaInscripcion();
                    $preferencias->inscripcion_id = $inscripcion->id;
                    if ($horario['todo_dia'] == true) {
                        $preferencias->todo_dia = 1;
                    } else {
                        $preferencias->inicio = $horario['inicio'];
                        $preferencias->fin = $horario['fin'];
                    }
                    $preferencias->mon = $horario['lunes'];
                    $preferencias->tue = $horario['martes'];
                    $preferencias->wed = $horario['miercoles'];
                    $preferencias->thu = $horario['jueves'];
                    $preferencias->fri = $horario['viernes'];
                    $preferencias->sat = $horario['sabado'];
                    $preferencias->sun = $horario['domingo'];
                    $preferencias->save();
                }
                return response()->json(['message' => 'Inscripción registrada'], 200);
            } else {
                return response()->json(['message' => 'El torneo se encuentra lleno'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Se ha producido un error en la inscripción. Por favor, inténtelo más tarde.', 'error' => $e->getMessage(),], 500);
        }
    }

    public function checkInscripcion($pareja, $torneo)
    {
        $integrantes = Integrante::where('id_pareja', $pareja)->get();

        foreach ($integrantes as $integrante) {
            $parejas = Integrante::where('id_jugador', $integrante->id_jugador)->get()->pluck('id_pareja');
            $inscripciones = Inscripcion::where('torneo_id', $torneo)->whereIn('pareja_id', $parejas)->get();
            if (count($inscripciones) != 0) {
                return false;
            }
        }
        return true;
    }

    public function getInscripciones($torneo)
    {
        $inscripciones = Inscripcion::where('torneo_id', $torneo)->get();

        $equipos = [];

        foreach ($inscripciones as $inscripcion) {
            $equipo = Pareja::where('id', $inscripcion->pareja_id)->first();
            $equipoI["id"] = $equipo->id;
            $equipoI["nombre"] = $equipo->nombre;
            $equipoI["validated"] = $inscripcion->validated;
            $integrantes = Integrante::where('id_pareja', $equipo->id)->get();
            $usuarios = [];
            foreach ($integrantes as $integrante) {
                $user = User::where('id', $integrante->id_jugador)->first(['id', 'name']);
                array_push($usuarios, $user);
            }
            $equipoI["usuarios"] = $usuarios;
            array_push($equipos, $equipoI);
        }

        return response()->json($equipos);
    }

    public function getResultados($torneo)
    {
        $inscripciones = Inscripcion::where('torneo_id', $torneo)
        ->with('pareja')
        ->orderBy('p_ganados', 'desc')
        ->orderByRaw('(s_ganados - s_perdidos) desc')
        ->get();
        return response()->json($inscripciones);
    }


    public function createRecurso(Request $request)
    {
        $cancha = new Cancha();
        $cancha->id_torneo = $request->torneo;
        $cancha->nombre = $request->cancha;
        $cancha->save();

        $torneo = Torneo::where('id', $request->torneo)->first();
        $fecha_inicio_torneo = strtotime($torneo->fecha_inicio);
        $fecha_fin_torneo = strtotime($torneo->fecha_fin);

        foreach ($request->horarios as $h) {

            $fecha_inicio = strtotime($h['fechaInicio']);
            $fecha_fin = strtotime($h['fechaFin']);

            $turno = $this->getDuracionTurno($h['inicio'], $h['fin'], $h['turnos']);

            $hora = $h['inicio'];
            $turnos = $h['turnos'];
            $horarios = [];

            if ($h['lunes']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'monday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }
            if ($h['martes']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'tuesday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }
            if ($h['miercoles']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'wednesday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }
            if ($h['jueves']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'thursday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }
            if ($h['viernes']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'friday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }
            if ($h['sabado']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'saturday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }
            if ($h['domingo']) {
                $recursos = $this->createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, 'sunday', $fecha_inicio_torneo, $fecha_fin_torneo);
                foreach ($recursos as $recurso) {
                    array_push($horarios, $recurso);
                }
            }

            foreach ($horarios as $horario) {
                $hor = new Horario();
                $hor->id_cancha = $cancha->id;
                $hor->inicio = date('Y-m-d H:i:s', strtotime($horario['inicio']));
                $hor->fin = date('Y-m-d H:i:s', strtotime($horario['fin']));
                $hor->save();
            }
        }
    }

    // Crea recursos para el día indicado entre las fechas de inicio y fin del torneo
    public function createRecursosDay($fecha_inicio, $fecha_fin, $hora, $turnos, $turno, $dia, $fecha_inicio_torneo, $fecha_fin_torneo)
    {
        $horarios = [];
        for ($fecha_inicio; $fecha_inicio <= $fecha_fin; $fecha_inicio = strtotime("+7 day", $fecha_inicio)) {
            $next_day = strtotime($dia, $fecha_inicio);

            if ($next_day < $fecha_inicio_torneo) continue;
            if ($next_day > $fecha_fin) break;
            if ($next_day > $fecha_fin_torneo) break;

            $inicio = strtotime(date('d-m-Y', $next_day) . ' ' . $hora);

            for ($i = 0; $i < $turnos; $i++) {

                $horario['inicio'] = date('d-m-Y H:i', $inicio);
                $inicio += $turno;
                $horario['fin'] = date('d-m-Y H:i', $inicio);

                array_push($horarios, $horario);
            }
        }
        return $horarios;
    }

    // Obtiene la duración de los turnos dada una hora de inicio y fin de disponibilidad de la cancha
    public function getDuracionTurno($inicio, $fin, $turnos)
    {
        $inicio = strtotime($inicio);
        $fin = strtotime($fin);
        $dif = $fin - $inicio;
        $interval = $dif / $turnos;
        return $interval;
    }

    // Apuntes
    // Function taken from W3schools: https://www.w3schools.in/php/examples/split-a-time-slot-between-the-start-and-end-time-using-the-time-interval
    // public function SplitTime($StartTime, $EndTime, $Duration = "60")
    // {
    //     $ReturnArray = array(); // Define output
    //     $StartTime    = strtotime($StartTime); //Get Timestamp
    //     $EndTime      = strtotime($EndTime); //Get Timestamp

    //     $AddMins  = $Duration * 60;

    //     while ($StartTime <= $EndTime) //Run loop
    //     {
    //         $ReturnArray[] = date("G:i", $StartTime);
    //         $StartTime += $AddMins; //Endtime check
    //     }
    //     return $ReturnArray;
    // }

    // Gran ayuda de un maestro de StackOverflow: https://stackoverflow.com/questions/61168832/simple-algorithm-to-create-round-robin-league-in-php

    public function generateCalendario(Request $request)
    {

        $torneo = Torneo::findOrFail($request->torneo);
        $inscripciones = Inscripcion::where('torneo_id', $torneo->id)->where('validated', 1)->pluck('pareja_id');

        if (count($inscripciones) < 2) return false;
        if (count($inscripciones) % 2 == 1) $inscripciones[] = 'blank'; // if number of inscripciones is even, add a dummy team that means 'this team don't play this round'

        $jornadas = $this->getJornadas(count($inscripciones));
        $partidosPorJornada = count($inscripciones) / 2;

        for ($round = 0; $round < $jornadas; $round++) {

            $jornada = new Jornada();
            $jornada->numero = $round + 1;
            $jornada->torneo_id = $torneo->id;
            $jornada->save();

            for ($i = 0; $i < $partidosPorJornada; $i++) {
                $opponent = count($inscripciones) - 1 - $i;
                if ($inscripciones[$i] != 'blank' && $inscripciones[$opponent] != 'blank') {
                    $partido = new Partido();
                    $partido->p1 = $inscripciones[$i];
                    $partido->p2 = $inscripciones[$opponent];
                    $partido->torneo_id = $torneo->id;
                    $partido->jornada_id = $jornada->id;
                    $partido->save();
                }
            }

            $result = $inscripciones;
            $tmp = $result[count($result) - 1];
            for ($i = count($result) - 1; $i > 1; --$i) {
                $result[$i] = $result[$i - 1];
            }
            $result[1] = $tmp;
        }

        $torneo->calendario_generado = 1;
        $torneo->estado = 1;
        $torneo->save();

        return response()->json(['message' => 'Calendario de jornadas generado'], 200);
    }

    // Función que devuelve el nº de jornadas en función de los equipos inscritos
    public function getJornadas($equipos)
    {
        switch ($equipos) {
            case 1:
                return false;
            case ($equipos % 2 == 0):
                return $equipos - 1;
            default:
                return $equipos;
        }
    }

    public function setHorariosJornada(Request $request)
    {
        $torneo = Torneo::where('id', $request->torneo)->with('canchas')->first();
        $canchas = [];
        foreach ($torneo->canchas as $cancha) {
            array_push($canchas, $cancha->id);
        }

        $fecha_inicio = date('Y-m-d 00:00', strtotime($request->fecha_inicio));
        $fecha_fin = date('Y-m-d 23:59', strtotime($request->fecha_fin));
        
        $todos_horarios = true;
        $jornada_completa = false;
        
        $partidos = Partido::where('jornada_id', $request->jornada)->whereNull('horario_id')->inRandomOrder()->get();
        if (count($partidos) == 0) {
            $jornada_completa = true;
            return response()->json(['message' => 'Jornada completa', 'jornada' => $jornada_completa, 'horarios' => $todos_horarios], 200);
        }

        $this->asignarHorariosPreferencias($partidos, $canchas, $fecha_inicio, $fecha_fin);

        $partidos = Partido::where('jornada_id', $request->jornada)->whereNull('horario_id')->inRandomOrder()->get();
        if (count($partidos) == 0) {
            $jornada_completa = true;
            return response()->json(['message' => 'Horarios asignados', 'jornada' => $jornada_completa, 'horarios' => $todos_horarios]);
        }

        $this->asignarHorariosPreferenciasParcial($partidos, $canchas, $fecha_inicio, $fecha_fin);

        $partidos = Partido::where('jornada_id', $request->jornada)->whereNull('horario_id')->inRandomOrder()->get();
        if (count($partidos) == 0) {
            $jornada_completa = true;
            return response()->json(['message' => 'Horarios asignados', 'jornada' => $jornada_completa, 'horarios' => $todos_horarios]);
        }

        foreach ($partidos as $partido) {
            $horario = Horario::whereIn('id_cancha', $canchas)->where('ocupado', 0)->where('inicio', '>=', $fecha_inicio)->where('inicio', '<=', $fecha_fin)->inRandomOrder()->first();
            if ($horario != null) {
                $partido->horario_id = $horario->id;
                $partido->save();
                $horario->ocupado = 1;
                $horario->save();
            } else {
                $todos_horarios = false;
                break;
            }
        }

        return response()->json(['message' => 'Horarios asignados', 'jornada' => $jornada_completa, 'horarios' => $todos_horarios]);
    }

    public function asignarHorariosPreferencias($partidos, $canchas, $fecha_inicio, $fecha_fin)
    {
        foreach ($partidos as $partido) {
            $inscripcion1 = Inscripcion::where('torneo_id', $partido->torneo_id)->where('pareja_id', $partido->p1)->first();
            $inscripcion2 = Inscripcion::where('torneo_id', $partido->torneo_id)->where('pareja_id', $partido->p2)->first();
            $preferencias1 = PreferenciaInscripcion::where('inscripcion_id', $inscripcion1->id)->get();
            $preferencias2 = PreferenciaInscripcion::where('inscripcion_id', $inscripcion2->id)->get();
            $horarios = Horario::whereIn('id_cancha', $canchas)->where('ocupado', 0)->where('inicio', '>=', $fecha_inicio)->where('inicio', '<=', $fecha_fin)->inRandomOrder()->get();
            if ($horarios != null) {
                foreach ($horarios as $horario) {
                    $horario_encontrado_prov = false;
                    $horario_encontrado = false;
                    $dia = substr(strtolower(date('l', strtotime($horario->inicio))), 0, 3);
                    foreach ($preferencias1 as $preferencia) {
                        if ($preferencia->$dia == 1) {
                            if ($preferencia->todo_dia == 1) {
                                $horario_encontrado_prov = true;
                                break;
                            } else {
                                if ($preferencia->inicio <= date('H:i:s', strtotime($horario->inicio)) && date('H:i:s', strtotime($horario->inicio)) <= $preferencia->fin) {
                                    $horario_encontrado_prov = true;
                                    break;
                                }
                            }
                        }
                    }
                    if ($horario_encontrado_prov) {
                        foreach ($preferencias2 as $preferencia) {
                            if ($preferencia->$dia == 1) {
                                if ($preferencia->todo_dia == 1) {
                                    // Este horario cuadra con el dia y la hora para la pareja 2 y, por lo tanto, para ambas
                                    $partido->horario_id = $horario->id;
                                    $partido->save();
                                    $horario->ocupado = 1;
                                    $horario->save();
                                    $horario_encontrado = true;
                                    break;
                                } else {
                                    if ($preferencia->inicio <= date('H:i:s', strtotime($horario->inicio)) && date('H:i:s', strtotime($horario->inicio)) <= $preferencia->fin) {
                                        // Este horario cuadra con el dia y la hora para la pareja 2 y, por lo tanto, para ambas
                                        $partido->horario_id = $horario->id;
                                        $partido->save();
                                        $horario->ocupado = 1;
                                        $horario->save();
                                        $horario_encontrado = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if ($horario_encontrado) {
                        break;
                    }
                }
            }
        }
    }

    public function asignarHorariosPreferenciasParcial($partidos, $canchas, $fecha_inicio, $fecha_fin)
    {
        foreach ($partidos as $partido) {
            $inscripcion1 = Inscripcion::where('torneo_id', $partido->torneo_id)->where('pareja_id', $partido->p1)->first();
            $inscripcion2 = Inscripcion::where('torneo_id', $partido->torneo_id)->where('pareja_id', $partido->p2)->first();
            $preferencias1 = PreferenciaInscripcion::where('inscripcion_id', $inscripcion1->id)->get();
            $preferencias2 = PreferenciaInscripcion::where('inscripcion_id', $inscripcion2->id)->get();
            $horarios = Horario::whereIn('id_cancha', $canchas)->where('ocupado', 0)->where('inicio', '>=', $fecha_inicio)->where('inicio', '<=', $fecha_fin)->inRandomOrder()->get();
            if ($horarios != null) {
                foreach ($horarios as $horario) {
                    $dia = substr(strtolower(date('l', strtotime($horario->inicio))), 0, 3);
                    $orden = rand(0, 1);
                    $acierto = false;

                    if ($orden == 1) {
                        foreach ($preferencias1 as $preferencia) {
                            if ($preferencia->$dia == 1) {
                                if ($preferencia->todo_dia == 1) {
                                    $partido->horario_id = $horario->id;
                                    $partido->save();
                                    $horario->ocupado = 1;
                                    $horario->save();
                                    $acierto = true;
                                    break;
                                } else {
                                    if ($preferencia->inicio <= date('H:i:s', strtotime($horario->inicio)) && date('H:i:s', strtotime($horario->inicio)) <= $preferencia->fin) {
                                        $partido->horario_id = $horario->id;
                                        $partido->save();
                                        $horario->ocupado = 1;
                                        $horario->save();
                                        $acierto = true;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        foreach ($preferencias2 as $preferencia) {
                            if ($preferencia->$dia == 1) {
                                if ($preferencia->todo_dia == 1) {
                                    $partido->horario_id = $horario->id;
                                    $partido->save();
                                    $horario->ocupado = 1;
                                    $horario->save();
                                    $acierto = true;
                                    break;
                                } else {
                                    if ($preferencia->inicio <= date('H:i:s', strtotime($horario->inicio)) && date('H:i:s', strtotime($horario->inicio)) <= $preferencia->fin) {
                                        $partido->horario_id = $horario->id;
                                        $partido->save();
                                        $horario->ocupado = 1;
                                        $horario->save();
                                        $acierto = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if($acierto) break;

                    if ($orden == 1) {
                        foreach ($preferencias2 as $preferencia) {
                            if ($preferencia->$dia == 1) {
                                if ($preferencia->todo_dia == 1) {
                                    $partido->horario_id = $horario->id;
                                    $partido->save();
                                    $horario->ocupado = 1;
                                    $horario->save();
                                    $acierto = true;
                                    break;
                                } else {
                                    if ($preferencia->inicio <= date('H:i:s', strtotime($horario->inicio)) && date('H:i:s', strtotime($horario->inicio)) <= $preferencia->fin) {
                                        // Este horario cuadra con el dia y la hora para la pareja 2 y, por lo tanto, para ambas
                                        $partido->horario_id = $horario->id;
                                        $partido->save();
                                        $horario->ocupado = 1;
                                        $horario->save();
                                        $acierto = true;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        foreach ($preferencias1 as $preferencia) {
                            if ($preferencia->$dia == 1) {
                                if ($preferencia->todo_dia == 1) {
                                    $partido->horario_id = $horario->id;
                                    $partido->save();
                                    $horario->ocupado = 1;
                                    $horario->save();
                                    $acierto = true;
                                    break;
                                } else {
                                    if ($preferencia->inicio <= date('H:i:s', strtotime($horario->inicio)) && date('H:i:s', strtotime($horario->inicio)) <= $preferencia->fin) {
                                        // Este horario cuadra con el dia y la hora para la pareja 2 y, por lo tanto, para ambas
                                        $partido->horario_id = $horario->id;
                                        $partido->save();
                                        $horario->ocupado = 1;
                                        $horario->save();
                                        $acierto = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    if($acierto) break;
                }
            }
        }
    }

    /* 
        Función para asignar horarios a todas las jornadas, desde el comienzo del campeonato hasta el final
        Jornadas de 7 días
        Todas seguidas, sin descansos, comenzando con la fecha de inicio del campeonato
    */
    // public function setHorariosCompleto(Request $request){
    //     $torneo = Torneo::findOrFail($request->torneo);
    //     $inscripciones = Inscripcion::where('torneo_id', $torneo->id)->pluck('pareja_id');
    //     $jornadas = $this->getJornadas(count($inscripciones));
    //     $partidosPorJornada = count($inscripciones) / 2;

    //     $fecha_inicio = date('Y-m-d H:i', strtotime($torneo->fecha_inicio));
    //     $fecha_fin = date('Y-m-d H:i', strtotime("+6 day", strtotime($fecha_inicio)));

    //     for ($round = 0; $round < $jornadas; ++$round) {
    //         for ($i = 0; $i < $partidosPorJornada; $i++) {
    //             $partido = Partido::where('jornada', $round)->whereNull('horario_id')->inRandomOrder()->first();
    //             if ($partido != null) {
    //                 $horario = Horario::where('ocupado', 0)->where('inicio', '>=', $fecha_inicio)->where('inicio', '<=', $fecha_fin)->inRandomOrder()->first();
    //                 if ($horario != null) {
    //                     $partido->horario_id = $horario->id;
    //                     $partido->save();
    //                     $horario->ocupado = 1;
    //                     $horario->save();
    //                 }
    //             }
    //         }
    //         $fecha_inicio = date('Y-m-d H:i', strtotime("+7 day", strtotime($fecha_inicio)));
    //         $fecha_fin = date('Y-m-d H:i', strtotime("+7 day", strtotime($fecha_fin)));
    //     }
    // }

    //Planteamiento erróneo inicial
    /*
        // for ($i = 0; $i < count($inscripciones)-1; $i++){
        //     for($j = $i+1; $j<count($inscripciones); $j++){
        //         $partido = new Partido();
        //         $partido->p1 = $inscripciones[$i];
        //         $partido->p2 = $inscripciones[$j];
        //         $partido->torneo_id = $torneo->id;
        //         $partido->save();
        //     }
        // }
    */

    public function validatePareja(Request $request)
    {
        if ($request->validate) {
            $inscripcion = Inscripcion::where('pareja_id', $request->pareja)->where('torneo_id', $request->torneo)->first();
            $inscripcion->validated = 1;
            $inscripcion->save();
            return response()->json(['message' => 'Pareja validada'], 200);
        } else {
            $inscripcion = Inscripcion::where('pareja_id', $request->pareja)->where('torneo_id', $request->torneo)->delete();
            return response()->json(['message' => 'Pareja eliminada del torneo'], 200);
        }
    }

    public function getHorariosTorneo($id, $isTorneo)
    {
        $horariosArr = [];
        if ($isTorneo == "true") {
            $canchas = Cancha::where('id_torneo', $id)->get();
            foreach ($canchas as $cancha) {
                $horarios = Horario::where('id_cancha', $cancha->id)->where('inicio', '>=', Carbon::now()->toDateTimeString())->orderBy('inicio', 'asc')->with('cancha:id,nombre')->get();
                foreach ($horarios as $horario) {
                    array_push($horariosArr, $horario);
                }
            }
        } else {
            $horarios = Horario::where('id_cancha', $id)->where('inicio', '>=', Carbon::now()->toDateTimeString())->orderBy('inicio', 'asc')->with('cancha:id,nombre')->get();
            foreach ($horarios as $horario) {
                array_push($horariosArr, $horario);
            }
            print_r("Hola, ahi van los horarios");
            
        }
        print_r($horariosArr);

        return response()->json($horariosArr);
    }

    public function deleteHorario($horario)
    {
        $horario = Horario::where('id', $horario)->first();
        if ($horario->ocupado == 0) {
            $horario->delete();
            return response()->json(['message' => 'Horario eliminado'], 200);
        } else {
            return response()->json(['message' => 'No se puede eliminar un horario en uso para un partido'], 403);
        }
    }

    public function getCancha($torneo)
    {
        $canchas = Cancha::where('id_torneo', $torneo)->get();
        return response()->json($canchas);
    }

    public function getHorariosDisponibles($id)
    {
        $horariosArr = [];
        $canchas = Cancha::where('id_torneo', $id)->get();
        foreach ($canchas as $cancha) {
            $horarios = Horario::where('ocupado', 0)->where('id_cancha', $cancha->id)->where('inicio', '>=', Carbon::now()->toDateTimeString())->orderBy('inicio', 'asc')->with('cancha:id,nombre')->get();
            foreach ($horarios as $horario) {
                array_push($horariosArr, $horario);
            }
        }
        return response()->json($horariosArr);
    }
}
