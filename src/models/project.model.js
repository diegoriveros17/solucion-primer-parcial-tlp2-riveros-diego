// * ARCHIVO A COMPLETAR
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectModel = sequelize.define("Project", {
  // TODO: 1. code: string, único y obligatorio.
  // TODO: 2. name: string, obligatorio.
  // TODO: 3. description: texto, obligatorio.
  // TODO: 4. status: ENUM con los valores planning, in_progress, paused y finished; obligatorio y con planning como valor por defecto.
  // TODO: 5. start_date: fecha (solo día), obligatoria.
  // TODO: 6. budget: decimal, obligatorio.
  // TODO: 7. leader_id: entero, obligatorio, clave foránea hacia User.
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("planning", "in_progess", "paused", "finished"),
    allowNull: false,
    defaultValue: "planning",
  },
  start_date: {
    type: DataTypes.DATE(),
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT(),
    allowNull: false,
  },
  leader_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: "users",
      key: "id",
    },
  },
});
