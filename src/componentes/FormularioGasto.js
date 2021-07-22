import React, { useState, useEffect } from "react";

import {
  ContenedorFiltros,
  Formulario,
  Input,
  InputGrande,
  ContenedorBoton,
} from "./../elementos/ElementosDeFormulario";
import Boton from "./../elementos/Boton";
import { ReactComponent as IconoPlus } from "./../imagenes/plus.svg";
import SelectCategorias from "./SelectCategorias";
import DatePicker from "./DatePicker";
import agregarGasto from "../firebase/agregarGasto";
import getUnixTime from "date-fns/getUnixTime";
import fromUnixTime from "date-fns/fromUnixTime";
import { useAuth } from "./../contextos/AuthContext";
import Alerta from "./../elementos/Alerta";
import { useHistory } from "react-router-dom";
import editarGasto from "./../firebase/editarGasto";

const FormularioGasto = ({ gasto }) => {
  const history = useHistory();
  const [inputDescripción, cambiarInputDescripción] = useState("");
  const [inputCantidad, cambiarInputCantidad] = useState("");
  const [categoria, cambiarCategoria] = useState("hogar");
  const [fecha, cambiarFecha] = useState(new Date());
  const { usuario } = useAuth();
  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});

  useEffect(() => {
    if (gasto) {
      if (gasto.data().uidUsuario === usuario.uid) {
        cambiarCategoria(gasto.data().categoria);
        cambiarFecha(fromUnixTime(gasto.data().fecha));
        cambiarInputDescripción(gasto.data().descripcion);
        cambiarInputCantidad(gasto.data().cantidad);
      } else {
        history.push("/lista");
      }
    }
  }, [gasto, usuario, history]);

  const handleChange = (e) => {
    if (e.target.name === "descripcion") {
      cambiarInputDescripción(e.target.value);
    } else if (e.target.name === "valor") {
      cambiarInputCantidad(e.target.value.replace(/[^0-9.]/g, ""));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let cantidad = parseFloat(inputCantidad).toFixed(2);

    if (inputDescripción !== "" && inputCantidad !== "") {
      if (cantidad) {
        if (gasto) {
          editarGasto({
            id: gasto.id,
            categoria: categoria,
            descripcion: inputDescripción,
            cantidad: cantidad,
            fecha: getUnixTime(fecha),
          })
            .then(() => {
              history.push("/lista");
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          agregarGasto({
            categoria: categoria,
            descripcion: inputDescripción,
            cantidad: cantidad,
            fecha: getUnixTime(fecha),
            uidUsuario: usuario.uid,
          })
            .then(() => {
              cambiarCategoria("hogar");
              cambiarInputDescripción("");
              cambiarInputCantidad("");
              cambiarFecha(new Date());

              cambiarEstadoAlerta(true);
              cambiarAlerta({
                tipo: "exito",
                mensaje: "El gasto fue agregado correctamente",
              });
            })
            .catch((error) => {
              cambiarEstadoAlerta(true);
              cambiarAlerta({
                tipo: "error",
                mensaje: "Hubo un problema al intentar agregar tu gasto",
              });
            });
        }
      } else {
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: "error",
          mensaje: "El valor que ingresaste no es correcto",
        });
      }
    } else {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: "error",
        mensaje: "Por favor completa todos los Valores",
      });
    }
  };

  return (
    <Formulario onSubmit={handleSubmit}>
      <ContenedorFiltros>
        <SelectCategorias
          categoria={categoria}
          cambiarCategoria={cambiarCategoria}
        />
        <DatePicker fecha={fecha} cambiarFecha={cambiarFecha} />
      </ContenedorFiltros>
      <div>
        <Input
          type="text"
          name="descripcion"
          placeholder="Descripción del gasto"
          value={inputDescripción}
          onChange={handleChange}
        />
        <InputGrande
          type="text"
          name="valor"
          placeholder="$0.00"
          value={inputCantidad}
          onChange={handleChange}
        />
        <ContenedorBoton>
          <Boton as="button" primario conIcono type="submit">
            {!gasto ? 'Agregar Gasto' : 'Editar Gasto'} <IconoPlus />
          </Boton>
        </ContenedorBoton>
      </div>
      <Alerta
        tipo={alerta.tipo}
        mensaje={alerta.mensaje}
        estadoAlerta={estadoAlerta}
        cambiarEstadoAlerta={cambiarEstadoAlerta}
      />
    </Formulario>
  );
};

export default FormularioGasto;
