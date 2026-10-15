// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { matchedData } from "express-validator";
import { Op } from "sequelize";

export const register = async (req, res) => {
  try {
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    // TODO: 2. Crear el user y su profile asociado.
    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
    const { username, email, password, role, profile } = matchedData(req, {
      locations: ["body"],
    });

    const { employee_number, first_name, last_name } = profile;

    const passwordHashed = await hashPassword(password);

    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
      role,
    });

    await ProfileModel.create({
      employee_number,
      first_name,
      last_name,
      user_id: newUser.id,
    });

    return res.status(201).json({
      message: `Usuario registrado correctamente ${newUser.username}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
    const { email, password } = matchedData(req, { locations: ["body"] });

    //comprobar si el usuario existe
    const userExist = await UserModel.findOne({ where: { email } });

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "Usuario o contreña incorrectos" });
    }

    //comprobar si la contraseña que ingresa el usuario coincide con la de la bd
    const validPassword = await comparePassword(password, userExist.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Usuario o contreña incorrectos" });
    }

    const token = await signToken({
      id: userExist.id,
      role: userExist.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return res
      .status(200)
      .json({ message: `Bienvenido, ${userExist.username}`, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  try {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
    res.clearCookie("token"); //Eliminar cookie del navegador
    return res.json({ message: `Has cerrado sesion` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
