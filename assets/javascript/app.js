   (function() {

        $(document).ready(function() {
            // Asegura que el wrapper siempre sea de la altura de la ventana
            $(".wrapper").css("min-height", $(window).height());

            // VARIABLES

            var preguntaActiva;
            var img_1;
            var img_2;
            var respuestasOk;
            var textoCorrecta;
            var q = 0;
            var opcion_elegida;
            var contadorOk = 0;
            var contadorfallos = 0;
            var id_intervalo;
            var theme = new Audio("assets/sounds/Enemy.mp3");

            // array con preguntas , su respuesta, opciones e imagenes
          


            // FUNCIONES

            // funcion para mezclar las preguntas
            function mezclarpreguntas() {

                var currIndex = ArrayPreguntas.length,
                    valortemporal, randomIndex;

                // Mientras alla todavia elementos para mezclar sigue ejecutando
                while (0 !== currIndex) {

                    // De los elementos restantes tomo uno al azar
                    randomIndex = Math.floor(Math.random() * currIndex);
                    currIndex -= 1;

                    // Lo intercambio de lugar con la pregunta actual
                    valortemporal = ArrayPreguntas[currIndex];
                    ArrayPreguntas[currIndex] = ArrayPreguntas[randomIndex];
                    ArrayPreguntas[randomIndex] = valortemporal;
                }
            }

            // funcion para girar la primera imagen cuando aparece
            function girar() {
				// Agrego las clases que hacen girar a un lado y luego agrego la clase que hace girar al otro lado.
                $("#lista-respuestas, #campo-imagen").addClass("flip");
                $("#lista-respuestas, #campo-imagen").toggleClass("flipback", "flip");
            }

            // Timer 

            var timer = {

                // Inicializo a 10 segundos por cada pregunta
                segundos: 10,

                // funcion para reducir el contador e ir mostrandolo
                decrement: function() {

                    // bajo de a 1 segundo
                    timer.segundos--;

                    // muestro los segundos que quedan
                    $("#time-left").html("&nbsp;&nbsp;" + timer.segundos);

                    // el contador se pone en rojo si faltan 3 o menos segundos
                    if (timer.segundos < 4) {
                        $("#time-left").css("color", "red");
                    }

                    // cambio 'segundos' por 'segundo' si solo falta 1 segundo
                    if (timer.segundos === 1) {
                        $("#segundos").html("segundo&nbsp;&nbsp;");
                    } else {
                        $("#segundos").text("segundos");
                    }

                    // Si el usuario no responde a tiempo, cuenta como una respuesta incorrecta y se muestra en pantalla la respuesta correcta.
                    if (timer.segundos === 0) {
                        contadorfallos++;
                        $("#" + textoCorrecta).addClass("correct");
                        $("#resultado-respuesta").html("<p>Te quedaste sin tiempo!</p><p>Era <span class='texto-correcto'>" + respuestasOk + "</span>.</p>");
                        
                        // detengo el timer
                        timer.stop();
                        
                        // saco la clase activa de lista-respuestas
                        $("#lista-respuestas").removeClass("activa");

                        // Mostrar la segunda imagen
                        $("#campo-imagen").html(img_2);

                        // Llamar a la siguiente pregunta
                        setTimeout(mostrarpreguntas, 3000);
                    }
                },

                // funcion para empezar timer
                run: function() {

                    // reinicio el intervalo de tiempo cada vez que el timer comienza
                    clearInterval(id_intervalo);

                    // ejecuto el setInterval para bajar el tiempo en 1 cada vez que pasen 1000 milisegundos (1 segundo)
                    id_intervalo = setInterval(timer.decrement, 1000);

                    // crea el display del timer
                    $("#timer").html("Tiempo restante: <span id='time-left'>10</span> <span id='segundos'>segundos</span>");

                    // siempre empezara en 10 segundos
                    $("#time-left").text(10);
                    timer.segundos = 10;
                },

                // funcion para detener el timer y reiniciar el intervalo
                stop: function() {

                    clearInterval(id_intervalo);
                }
            };

            // funcion para mostrar preguntas y respuestas

            function mostrarpreguntas() {

                // gira la imagen y las respuestas cada vez que una nueva pregunta aparece 
                girar();
				
				// Remuevo la clase brillo para poder hacer el efecto nuevamente cuando cambie la imagen
				$("#campo-imagen").removeClass("brillo");

                // sigue mostrando preguntas mientras haya disponibles sin responder en el array
				// si agrego mas preguntas puedo hacer que siempre sean diez o que sean todas ArrayPreguntas.length
                if (q < 10) {

                    // vacio los campos del display y comienza a correr el timer
                    $("#pregunta-activa, #lista-respuestas, #campo-imagen, #resultado-respuesta").empty();
                    timer.run();

                    // asigno la pregunta activa  para sacar sus datos del array
                    preguntaActiva = ArrayPreguntas[q].pregunta;

                    // asigno las variables de imagen
                    img_1 = $("<img class='img-fluid'>").attr("src", ArrayPreguntas[q].primer_img);
                    img_2 = $("<img class='img-fluid'>").attr("src", ArrayPreguntas[q].segunda_img);

                    // agrego la pregunta y la primera imagen
                    $("#pregunta-activa").append("<h2>" + preguntaActiva + "</h2>");
                    $("#campo-imagen").append(img_1);

                    // declaro un array para contener las respuestas de cada pregunta
                    var respuestas = [];
                    respuestas = [ArrayPreguntas[q].respuesta, ArrayPreguntas[q].respuestasfalsas[0], ArrayPreguntas[q].respuestasfalsas[1], ArrayPreguntas[q].respuestasfalsas[2]];

                    // mezclo las respuestas
                    var currentIndex = respuestas.length,
                        valortemporal, randomIndex;

                    // Mientras haya elementos en el array para mezclar
                    while (0 !== currentIndex) {

                        // Se toma un elemento random...
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;

                        // Y se intercambia de orden con otro elemento del array
                        valortemporal = respuestas[currentIndex];
                        respuestas[currentIndex] = respuestas[randomIndex];
                        respuestas[randomIndex] = valortemporal;
                    }

                    // asigno la respuesta correcta
                    respuestasOk = ArrayPreguntas[q].respuesta;

                    // asigno a otra variable la respuesta correcta sin espacios para mostrarla
                    textoCorrecta = respuestasOk.replace(/\s/g, "");

                    // asigno la clase activa para que se puedan clickear los botones
                    $("#lista-respuestas").addClass("activa");

                    // created list items from shuffled array and include unique ids without spaces
                    for (var i = 0; i < 4; i++) {
                        $("#lista-respuestas").append("<li class='item-respuesta text-center' id='" + respuestas[i].replace(/\s/g, "") + "'>" + respuestas[i] + "</li>");
                    }

                    // incrementa el numero de pregunta para buscar la siguiente
                    q++;

                // finaliza el juego si no hay mas preguntas
                } else {
                    endGame();
                }
            }

            // funcion para empezar el juego, sonar la musica, mezclar las preguntas y mostrarlas
            function startGame() {
                theme.play();
                mezclarpreguntas();
                mostrarpreguntas();
            }

            //  funcion para detener el juego, vaciar el display y mostrar el boton para ver los resultados
            function endGame() {
                timer.stop();
                $("#pregunta-activa, #lista-respuestas, #timer, #resultado-respuesta, #campo-imagen").empty();
                $("#result-holder").html("<button id='resultados'><i class='fa fa-crosshairs '></i>&nbsp; Ver puntaje</button>");
            }

            // funcion para mostrar los resultados y un mensaje segun el puntaje
            function resultados() {
                $(".tally").append("<h2 class='mb-1'>A ver como te fue:</h2>").append("<p>Respuestas correctas: " + contadorOk + "</p>").append("<p>Respuestas incorrectas: " + contadorfallos + "</p>");
                // Puntaje entre 8 y 10
                if (contadorOk > 7) {
                    $(".tally").append("<img class='img-fluid mt-3' src='assets/images/exito.jpg' alt='Vi con hextech' />");
                    $(".tally").append("<p class='mt-3'>Excelente! Se ve que te encanto la serie!</p>");

                // Puntaje entre  4 y 7
                } else if (contadorOk > 3 & contadorOk < 8) {
                    $(".tally").append("<img class='img-fluid mt-3' src='assets/images/jinx.jpg' alt='Jinx decepcionada' />");
                    $(".tally").append("<p class='mt-3'>Flojo! Deberias prestar mas atencion!</p>");

                // Puntaje entre 0 y 3
                } else {
                    $(".tally").append("<img class='img-fluid mt-3' src='assets/images/fracaso.jpg' alt='Vi decepcionada' />");
                    $(".tally").append("<p class='mt-3'>Que desastre!!</p>");
                }
            }


            // CLICK EVENTS

            // resuelvo el evento ante un click
            $(document).on("click", ".activa .item-respuesta", function() {

                // detengo el timer y asigno la opcion elegida por el usuario
                timer.stop();
                opcion_elegida = $(this).text();

                // Si la respuesta es correcta
                if (opcion_elegida === respuestasOk) {

                    // sumo a las respuestas correctas, coloreo la opcion correcta y la muestro en la parte de arriba 
                    contadorOk++;
                    $(this).addClass("correct");
                    $("#resultado-respuesta").html("<p class='texto-correcto'>Bien!</p><p class='texto-correcto'>Correcto!</p>");

                    // deshabilito los botones de las respuestas
                    $("#lista-respuestas").removeClass("activa");

                    // cambio a la segunda imagen
					$("#campo-imagen").addClass("brillo");
                    $("#campo-imagen").html(img_2);
					
                    // llamo a la funcion para mostrar la siguiente pregunta
                    setTimeout(mostrarpreguntas, 3000);

                // Si la respuesta es incorrecta
                } else {

                    // sumo a las respuestas incorrectas respuesta, coloreo la opcion correcta y la seleccionada y  muestro la correcta en la parte de arriba 
                    contadorfallos++;
                    $(this).addClass("wrong");
                    $("#" + textoCorrecta).addClass("correct");
                    $("#resultado-respuesta").html("<p>Wrong!</p><p>It was <span class='texto-correcto'>" + respuestasOk + "</span></p>");

                    // deshabilito los botones de las respuestas
                    $("#lista-respuestas").removeClass("activa");

                    // cambio a la segunda imagen
					$("#campo-imagen").addClass("brillo");
                    $("#campo-imagen").html(img_2);

                      // llamo a la funcion para mostrar la siguiente pregunta
                    setTimeout(mostrarpreguntas, 3000);
				
                }
            });

            // Evento click para iniciar el juego
            $("#iniciarjuego").on("click", function() {
                $(".header-container").hide();
                $("main").show();
                startGame();
            });

            // Evento click  para mostrar los resultados
            $(document).on("click", "#resultados", function() {
                $("#pregunta-activa").empty();
                $("main").hide();
                $(".endgame").show();
                resultados();
            });

            // Evento click  para resetear el juego
            $(document).on("click", "#reset-game", function() {
                $(".tally, #result-holder").empty();
                $(".endgame").hide();
                $(".header-container").show();
                q = 0;
                contadorOk = 0;
                contadorfallos = 0;
				theme.pause();
				theme.currentTime = 0;
            });

        });
    })();