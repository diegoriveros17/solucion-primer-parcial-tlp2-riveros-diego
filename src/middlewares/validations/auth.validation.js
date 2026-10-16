// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  // ? Las unicidades requieren una validación personalizada asíncrona.
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo puede tener letras y números")
    .custom(async (username) => {
      const user = await UserModel.findOne({
        where: { username },
      });
      if (user) {
        throw new Error("El nombre de usuario ya se encuentra en uso");
      }
      return true;
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .custom(async (email) => {
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        throw new Error("El correo electrónico ya se encuentra registrado");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener como minimo 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La password debe tener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La password debe tener al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La password debe tener al menos un número"),
  body("role")
    .optional()
    .isIn(["developer", "administrador"])
    .withMessage("El rol solo puede ser developer o admininistrador"),
  body("profile.employee_number")
    .trim()
    .notEmpty()
    .matches(/^[A-Za-z0-9-]{3,20}$/)
    .withMessage(
      "El número de empleado solo puede tener letras, números y guiones (3 a 20 caracteres)",
    )
    .custom(async (employee_number) => {
      const employeeExist = await ProfileModel.findOne({
        where: { employee_number },
      });
      if (employeeExist)
        throw new Error("El número de empleado ya está en uso");
      return true;
    }),
  body("profile.first_name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-z]+$/)
    .withMessage("El nombre solo puede tener letras"),
  body("profile.last_name")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-z]+$/)
    .withMessage("El apellido solo puede tener letras"),
  body("profile.phone")
    .optional({ values: "falsy" })
    .matches(/^\+?[0-9\s-]{6,20}$/)
    .withMessage("El teléfono no tiene un formato válido"),
  ,
];

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  // TODO: 8. Validar password: obligatoria.
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("La contraseña es obligatoria"),
];
