[
  {
    "id": 1,
    "nombre": "CB1",
    "descripcion": "Transporta el bagazo generado en la molienda para iniciar el ciclo de alimentación de la caldera, ubicado entre molinos y calderas de baja.",
    "color": "red",
    "tipo": "Conductor Principal"
  },
  {
    "id": 2,
    "nombre": "CB2",
    "descripcion":  "Distribuye el bagazo entre el CB5 que envía bagacillo a elaboración y el C6 que continúa el ciclo de alimentación de la caldera.",
    "color": "red",
    "tipo": "Distribuidor"
  },
  {
    "id": 3,
    "nombre": "CB3",
    "descripcion": " Retorna bagazo al proceso y distribuye el sobrante para stock de combustible.",
    "color": "red",
    "tipo": "Retorno"
  },
  {
    "id": 4,
    "nombre": "CB4",
    "descripcion": " Retorna el bagazo al proceso y sirve como contingencia de conductor CB11 o CB12.",
    "color":"red",
    "tipo":" Contingencia"
  },
  {
    "id": 5,
    "nombre": "CB5",
    "descripcion": " Transporta el bagacillo al área de elaboración a los filtros de cachaza contribuyen al proceso de clarificación.",
    "color":"green",
    "tipo":"Transporte Bagacillo"
  },
  {
    "id": 6,
    "nombre": "CB6",
    "descripcion": " Permite la transición entre el flujo de bagazo de molienda y la reposición de bagazo para el proceso de generación de vapor.",
    "color":"red",
    "tipo":"Transición"
  },
  {
    "id": 7,
    "nombre": "CB7",
    "descripcion": "Transporta el bagazo para el proceso de generación de vapor.",
    "color": "red",
    "tipo": "Generación Vapor"
  },
  {
    "id": 8,
    "nombre": "CB8",
    "descripcion": "Suministra el bagazo a los alimentadores de la caldera.",
    "color": "yellow",
    "tipo": " Alimentador"
  },
  {
    "id": 9,
    "nombre": "CB9",
    "descripcion": "Recibe el bagazo restante del tobogán de retorno y el CB8.",
    "color": "red",
    "tipo": "Recolector"
  },
  {
    "id": 10,
    "nombre": "CB10",
    "descripcion": "Conductor principal de distribución y control del flujo de bagazo en el sistema.",
    "color": "green",
    "tipo": "Distribuidor Principal"
  },
  {
    "id": 11,
    "nombre": "CB11",
    "descripcion": "Conductor de reposición de bagazo, es alimentado por el bagazo almacenado en la bagacera cuando para o disminuye la molienda.",
    "color": "green",
    "tipo": "Reposición"
  },
  {
    "id": 12,
    "nombre": "CB12",
    "descripcion": "Transporta el bagazo que ingresa del CB11 al CB6.",
    "color": "green",
    "tipo": "Transporte"
  }
]