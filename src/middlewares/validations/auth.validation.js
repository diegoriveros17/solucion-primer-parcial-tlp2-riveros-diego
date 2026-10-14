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
    .withMessage("La contraseña debe tener entre como minimo 8 caracteres"),
  body("role")
    .optional()
    .isIn(["developer", "administrador"])
    .withMessage("El rol solo puede ser developer o admininistrador"),
  body("profile.employee_number")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El numero de empleado deber ser un numero entero")
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
    .withMessage("El nombre no puede ser vacio"),
  body("profile.last_name")
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede ser vacio"),
  body("profile.phone").optional(),
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
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
