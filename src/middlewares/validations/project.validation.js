// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";
import { Op } from "sequelize";

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  // TODO: 2. Validar name y description como obligatorios.
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
  body("code")
    .trim()
    .notEmpty()
    .withMessage("El code es obligatorio")
    .matches(/^[A-Z0-9-]{3,30}$/)
    .withMessage(
      "El code solo puede tener mayúsculas, números y guiones (ej: PRJ-001)",
    )
    .custom(async (code) => {
      const codeExist = await ProjectModel.findOne({ where: { code } });
      if (codeExist) throw new Error("El codigo ya existe");
      return true;
    }),
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),
  body("status")
    .optional()
    .isIn(["planning", "in_progress", "paused", "finished"])
    .withMessage(
      `El status solo puede ser planning, in_progress, paused o finished`,
    ),
  body("start_date")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .isISO8601()
    .withMessage("La fecha de inicio no es válida"),
  body("budget")
    .notEmpty()
    .withMessage("El presupuesto es obligatorio")
    .isFloat()
    .withMessage("El presupuesto debe ser un número positivo"),
  body("leader_id")
    .notEmpty()
    .withMessage("El líder es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El leader_id debe ser un entero")
    .bail()
    .custom(async (leader_id) => {
      const userExist = await UserModel.findByPk(leader_id);
      if (!userExist) throw new Error("El líder no existe");
      return true;
    }),
  body("technologies")
    .isArray()
    .withMessage("technologies debe ser una lista de ids"),
  body("technologies.*")
    .isInt({ min: 1 })
    .withMessage("Cada technology debe ser un id entero"),
  body("technologies").custom(async (ids) => {
    if (!Array.isArray(ids)) return true; // el error ya lo informa isArray
    const unique = [...new Set(ids)];
    const count = await TechnologyModel.count({ where: { id: unique } });
    if (count !== unique.length) throw new Error("Alguna technology no existe");
    return true;
  }),
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
  body("code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El code es obligatorio")
    .matches(/^[A-Z0-9-]{3,30}$/)
    .withMessage(
      "El code solo puede tener mayúsculas, números y guiones (ej: PRJ-001)",
    )
    .custom(async (code, { req }) => {
      const found = await ProjectModel.findOne({
        where: { code, id: { [Op.ne]: req.params.id } },
      });
      if (found) throw new Error("El code ya existe");
      return true;
    }),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),
  body("status")
    .optional()
    .isIn(["planning", "in_progress", "paused", "finished"])
    .withMessage(
      `El status solo puede ser planning, in_progress, paused o finished`,
    ),
  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio no es válida"),
  body("budget")
    .optional()
    .isFloat()
    .withMessage("El presupuesto debe ser un número positivo"),
  body("leader_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El leader_id debe ser un entero")
    .bail()
    .custom(async (leader_id) => {
      const userExist = await UserModel.findByPk(leader_id);
      if (!userExist) throw new Error("El líder no existe");
      return true;
    }),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("technologies debe ser una lista de ids"),
  body("technologies.*")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Cada technology debe ser un id entero"),
  body("technologies")
    .optional()
    .custom(async (ids) => {
      if (!Array.isArray(ids)) return true; // el error ya lo informa isArray
      const unique = [...new Set(ids)];
      const count = await TechnologyModel.count({ where: { id: unique } });
      if (count !== unique.length)
        throw new Error("Alguna technology no existe");
      return true;
    }),
];
