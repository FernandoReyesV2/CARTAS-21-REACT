import React, { useState, useEffect } from 'react';
// import "./cartas.css";
// import estilos from '/cartas.module.css';

export default function Cartas() {
  const [baraja, setBaraja] = useState('');
  const [cartas, setCartas] = useState([]);
  const [manoUsuario, setManoUsuario] = useState([]);
  const [manoMaquina, setManoMaquina] = useState([]);
  const [resultado, setResultado] = useState('');
  const [valorManoUsuario, setValorManoUsuario] = useState(0);
  const [valorManoMaquina, setValorManoMaquina] = useState(0);
  const [turnoTerminado, setTurnoTerminado] = useState(false);
  const [juegoComenzado, setJuegoComenzado] = useState(false);
  const [cartasUsadas, setCartasUsadas] = useState([]);
  const [mensajeFinal, setMensajeFinal] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [pedirCartaHabilitado, setPedirCartaHabilitado] = useState(true);
  const [turnoMaquinaActivo, setTurnoMaquinaActivo] = useState(false);

  useEffect(() => {
    SolicitudCartas();
  }, []);

  const SolicitudCartas = async () => {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = await response.json();
      setBaraja(data.deck_id);
    } catch (error) {
      console.error('Error al obtener el mazo de cartas', error);
    }
  };

  const AsignarCartasUsuario = async () => {
    if (valorManoUsuario <= 21) {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${baraja}/draw/?count=1`);
      const data = await response.json();
      const nuevaCarta = data.cards[0];
  
      setCartas([...cartas, nuevaCarta]);
      setManoUsuario((prevManoUsuario) => [...prevManoUsuario, nuevaCarta]);
  
      const nuevoValorManoUsuario = calcularValorMano([...manoUsuario, nuevaCarta]);
      setValorManoUsuario(nuevoValorManoUsuario);
  
      setCartasUsadas([...cartasUsadas, nuevaCarta]);
      console.log("Llego a AsignarCartasUsuario", mensajeFinal);
  
      if (nuevoValorManoUsuario > 21) {
        setMensajeFinal("¡Perdiste! Tu mano superó 21.");
        setJuegoComenzado(false);
        setMostrarMensaje(true);
      }
    }
  };

  const AsignarCartasMaquina = async () =>{
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${baraja}/draw/?count=1`);
    const data = await response.json();
    const nuevaCarta = data.cards[0];
  
    setCartas([...cartas, nuevaCarta]);
    setManoMaquina((prevManoMaquina) => [...prevManoMaquina, nuevaCarta]);
  
    const nuevoValorManoMaquina = calcularValorMano([...manoMaquina, nuevaCarta]);
    setValorManoMaquina(nuevoValorManoMaquina);
  
    setCartasUsadas([...cartasUsadas, nuevaCarta]);
    console.log("AsignarCartasMaquina", mensajeFinal);
  }
  const AcabarTurno = async () => {
    const nuevoValorManoMaquina = calcularValorMano(manoMaquina);

    if (nuevoValorManoMaquina < 18) {
      await AsignarCartasMaquina();
      setTurnoMaquinaActivo(true);
    } else {
      let resultadoComparaciones = '';

      if (nuevoValorManoMaquina > 21) {
        resultadoComparaciones = "La máquina perdió. ¡Ganaste!";
      } else if (nuevoValorManoMaquina <= 21 && nuevoValorManoMaquina > valorManoUsuario) {
        resultadoComparaciones = "¡La máquina ganó!";
      } else if (nuevoValorManoMaquina === valorManoUsuario) {
        resultadoComparaciones = "Empate.";
      } else {
        resultadoComparaciones = "¡Usuario Gana!";
      }

      if (resultadoComparaciones !== '') {
        setMensajeFinal(resultadoComparaciones);
        setMostrarMensaje(true);
        setPedirCartaHabilitado(false);
        setTurnoMaquinaActivo(false);
      }
    }
  };

  const EmpezarTurno = async () => {
    setManoUsuario([]);
    setManoMaquina([]);
    setCartas([]);
    setValorManoUsuario(0);
    setValorManoMaquina(0);
    setResultado('');
    setTurnoTerminado(false);
    setJuegoComenzado(true);
    setMostrarMensaje(false);
    setTurnoMaquinaActivo(true);

    await AsignarCartasUsuario();
    await AsignarCartasUsuario();
    await AsignarCartasMaquina();
    await AsignarCartasMaquina();
    console.log("Llego a EmpezarTurno");
  };

  const ReiniciarJuego = () => {
    setManoUsuario([]);
    setManoMaquina([]);
    setCartas([]);
    setValorManoUsuario(0);
    setValorManoMaquina(0);
    setResultado('');
    setTurnoTerminado(false);
    setJuegoComenzado(false);
    setCartasUsadas([]);
    setMensajeFinal('')
  };

  const calcularValorMano = (mano) => {
    let valor = 0;
    mano.forEach((carta) => {
      const valorCarta = carta.value;
      if (valorCarta === 'ACE') {
        valor += 1;
      } else if (isNaN(valorCarta)) {
        valor += 10;
      } else {
        valor += parseInt(valorCarta);
      }
    });

    return valor;
  };

  useEffect(() => {
    setValorManoUsuario(calcularValorMano(manoUsuario));
  }, [manoUsuario]);

  useEffect(() => {
    setValorManoMaquina(calcularValorMano(manoMaquina));
  }, [manoMaquina]);

  const Mensaje = () => {
    const mensajeStyles = "text-center text-2xl mb-5 mt-5 text-white font-bold";
  
    return mostrarMensaje ? (
      <div>
        <p className={mensajeStyles}>Resultado: {mensajeFinal}</p>
      </div>
    ) : null;
  };

  return (
    <>
      <Mensaje />
      <div className='Botones flex justify-center mt-10'>
        <button onClick={EmpezarTurno} disabled={juegoComenzado} className='EmpezarTurno btn-green'>
          Empezar Turno
        </button>
        <button onClick={AcabarTurno} disabled={!juegoComenzado || turnoTerminado} className='AcabarTurno btn-orange'>
          Acabar Turno
        </button>
        <button onClick={AsignarCartasUsuario} disabled={!juegoComenzado || turnoTerminado} className='PedirCarta btn-orange'>
          Pedir Carta
        </button>
        <button onClick={ReiniciarJuego} className='Reiniciar btn-red'>Reiniciar</button>
      </div>
      <div className='CartasAmbos m-0'>
        <p className='MaquinaMano mb-10 text-white text-2xl font-bold flex justify-center'>
          Valor de la mano de la Máquina: {valorManoMaquina}
        </p>
        <div className='MaquinaCarta flex justify-center'>
          {manoMaquina.map((carta, index) => (
            <img key={`M-${index}`} src={carta.image} alt={carta.code} className='w-40' />
          ))}
        </div>
        <p className='UsuarioMano mt-10 text-white text-2xl font-bold flex justify-center' >
          Valor de la mano del Usuario: {valorManoUsuario}
        </p>
        <div className='UsuarioCarta flex justify-center'>
          {manoUsuario.map((carta, index) => (
            <img key={`U-${index}`} src={carta.image} alt={carta.code} className='w-60' />
          ))}
        </div>
      </div>
    </>
  );
}