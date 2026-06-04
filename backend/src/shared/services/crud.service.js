import { ErrHandeler } from "../utils/err.handelers.js";

export async function sharedFetchAll(database) {
  return await ErrHandeler(database.findAll());
}

export async function sharedAddingData(body, database) {
  return await ErrHandeler(database.create(body));
}

export async function sharedUpdatingUser(id, body, database) {
  return await ErrHandeler(
    database.update(body, {
      where: {
        id: id,
      },
    }),
  );
}

export async function sharedDeleteUser(id, key, database) {
  return await ErrHandeler(
    database.destroy({
      where: {
        [key]: id,
      },
    }),
  );
}

export async function sharedGetDataById(id, database) {
  return await ErrHandeler(database.findByPk(id));
}
