"use client"
import styles from './style.module.css'
import { useState, useEffect } from 'react';

export default function Juego() {
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [temporizador, setTemporizador] = useState(15);
  const [nombreJugador, setNombreJugador] = useState('');
  const [tablaPuntuaciones, setTablaPuntuaciones] = useState([]);
  const [pistas, setPistas] = useState(0);
  const [jugadorIngresado, setJugadorIngresado] = useState(false);

  useEffect(() => {
    async function obtenerPaises() {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
      const data = await res.json();
      setPaises(data.data);
      seleccionarPaisAleatorio(data.data);
    }

    obtenerPaises();
  }, []);

  
    useEffect(() => {
      if (temporizador === 0) {
        setPuntos((prevPuntos) => prevPuntos - 1);
        seleccionarPaisAleatorio(paises);
      } else {
        const cuentaRegresiva = setTimeout(() => setTemporizador(temporizador - 1), 1000);
        return () => clearTimeout(cuentaRegresiva);
      }
    }, [temporizador, paises]);
 

  

  useEffect(() => {
    const puntuacionesGuardadas = JSON.parse(localStorage.getItem('tablaPuntuaciones')) || [];
    setTablaPuntuaciones(puntuacionesGuardadas);
  }, []);

  const seleccionarPaisAleatorio = (paises) => {
    const indiceAleatorio = Math.floor(Math.random() * paises.length);
    setPaisSeleccionado(paises[indiceAleatorio]);
    setPistas(0);
    setTemporizador(15);

    
  };

  const manejarAdivinanza = () => {
    if (respuesta.toLowerCase() == paisSeleccionado.name.toLowerCase()) {
      setPuntos((prevPuntos) => prevPuntos + 1);
    } else {
      setPuntos((prevPuntos) => prevPuntos - 1);
    }
    setRespuesta('');
    seleccionarPaisAleatorio(paises);
  };



  const guardarPuntuacion = () => {
    const nuevaTablaPuntuaciones = [...tablaPuntuaciones, { nombre: nombreJugador, puntos }];
    setTablaPuntuaciones(nuevaTablaPuntuaciones);
    localStorage.setItem('tablaPuntuaciones', JSON.stringify(nuevaTablaPuntuaciones));
    setPuntos(0);
    setJugadorIngresado(false);
  };

  const iniciarJuego = () => {
    if (nombreJugador.trim() === '') {
      alert('Por favor, ingresa tu nombre para comenzar el juego.');
    } else {
      setJugadorIngresado(true);
      setTemporizador(15);

    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.h1}>Juego de Adivinanza de Banderas</h1>

      {!jugadorIngresado ? (
        <div className={styles.div_jugador}>
          <label className={styles.label}>
            Nombre del Jugador:
            <input
              className={styles.input}
              type="text"
              value={nombreJugador}
              onChange={(e) => setNombreJugador(e.target.value)}
              required
            />
          </label>
          <button className={styles.button} onClick={iniciarJuego}>Comenzar Juego</button>
        </div>
      ) : (
        <div className={styles.padre}>
          {paisSeleccionado && (
            <div className={styles.padre_andentro}>
              <img className={styles.img} src={paisSeleccionado.flag} alt="bandera del país" />
              <p>Adivina el país:</p>
              <input
                className={styles.input}
                type="text"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <div className={styles.button_group}>
                <button className={styles.button2} onClick={manejarAdivinanza}>Adivinar</button>
                <button className={styles.button} onClick={guardarPuntuacion}>Guardar Puntuación</button>
              </div>
              <p className={styles.puntos}>Puntos: {puntos}</p>
            </div>
          )}
          { (<p>Tiempo:{temporizador}</p>)}
        </div>
      )}

      

      <div>
        <h2>Tabla de Puntuaciones</h2>
        <ul className={styles.ul}>
          {tablaPuntuaciones.map((entrada, indice) => (
            <li className={styles.li} key={indice}>{entrada.nombre}: {entrada.puntos}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
