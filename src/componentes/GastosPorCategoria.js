import React from "react";

import { Helmet } from "react-helmet";
import { Header, Titulo } from "../elementos/Header";
import BtnRegresar from "../elementos/BtnRegresar";
import BarraTotalGastado from "./BarraTotalGastado";
import useObtenerGastosDelMesPorCategoria from "./../hooks/useObtenerGastosDelMesPorCategoria";
import {
  ListaDeCategorias,
  ElementoListaCategorias,
  Categoria,
  Valor,
} from "./../elementos/elementosDeLista";
import IconoCategoria from "./../elementos/IconoCategoria";
import convertirAMoneda from "./../funciones/convertirAMoneda";

const GastosPorCategoria = () => {
  const gastosPorCategoria = useObtenerGastosDelMesPorCategoria();
  return (
    <>
      <Helmet>
        <title>Gastos por Categoria</title>
      </Helmet>
      <Header>
        <BtnRegresar />
        <Titulo>Gastos por Categoria</Titulo>
      </Header>
      <ListaDeCategorias>
        {gastosPorCategoria.map((elemento, index) => {
          return (
            <ElementoListaCategorias key={index}>
              <Categoria>
                <IconoCategoria id={elemento.categoria} />
                {elemento.categoria}
              </Categoria>
              <Valor>{convertirAMoneda(elemento.cantidad)}</Valor>
            </ElementoListaCategorias>
          );
        })}
      </ListaDeCategorias>

      <BarraTotalGastado />
    </>
  );
};

export default GastosPorCategoria;
