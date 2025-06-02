import { BulkCreateOptions, Model, ModelStatic, Transaction } from "sequelize";

class BaseDAL {
  /**
   *
   *
   * @static
   * @param ObjectType
   * @param payload
   * @param {Transaction} t
   * @memberof BaseDAL
   */
  static create = <T extends Model>(
    ObjectType: ModelStatic<T>,
    payload: any,
    t?: Transaction
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      ObjectType.create(payload, { transaction: t })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param payload
   * @param {Transaction} t
   * @param options
   * @memberof BaseDAL
   */
  static bulkCreate = <T extends Model>(
    ObjectType: ModelStatic<T>,
    payload: any[],
    t?: Transaction,
    options?: BulkCreateOptions<T>
  ): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      ObjectType.bulkCreate(payload, { transaction: t, ...options })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param {*} options
   * @param paranoid
   * @memberof BaseDAL
   */
  static findMany = <T extends Model>(
    ObjectType: ModelStatic<T>,
    options: any,
    paranoid = false
  ): Promise<{ rows: T[]; count: number }> => {
    return new Promise((resolve, reject) => {
      ObjectType.findAndCountAll({
        distinct: true,
        ...options,
        paranoid,
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param id
   * @param options
   * @param paranoid
   * @memberof BaseDAL
   */
  static findById = <T extends Model>(
    ObjectType: ModelStatic<T>,
    id: string,
    options?: any,
    paranoid = false
  ): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      ObjectType.findByPk(id, { ...options, paranoid })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param {*} options
   * @param paranoid
   * @memberof BaseDAL
   */
  static findOne = <T extends Model>(
    ObjectType: ModelStatic<T>,
    options: any,
    paranoid = false
  ): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      ObjectType.findOne({ ...options, paranoid })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param object
   * @param {Partial<User>} payload
   * @param t
   * @memberof BaseDAL
   */
  static update = <T extends Model>(
    ObjectType: ModelStatic<T>,
    object: T,
    payload: any,
    t?: Transaction
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      object = Object.assign(object, payload);

      object
        .save({ transaction: t })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param rule
   * @param {Partial<User>} payload
   * @param t
   * @memberof BaseDAL
   */
  static bulk_update = <T extends Model>(
    ObjectType: ModelStatic<T>,
    rule: any,
    payload: any,
    t?: Transaction
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      ObjectType.update(payload, { where: rule, transaction: t })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param {*} query
   * @param t
   * @param force
   * @memberof BaseDAL
   */
  static delete = <T extends Model>(
    ObjectType: ModelStatic<T>,
    query: any,
    t?: Transaction,
    force = false
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      ObjectType.destroy({ where: query, transaction: t, force })
        .then(() => {
          resolve(true);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param rule
   * @param t
   * @param force
   * @memberof BaseDAL
   */
  static bulk_delete = <T extends Model>(
    ObjectType: ModelStatic<T>,
    rule: any,
    t?: Transaction,
    force = false
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      ObjectType.destroy({ where: rule, transaction: t, force })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param {*} query
   * @param t
   * @memberof BaseDAL
   */
  static restore = <T extends Model>(
    ObjectType: ModelStatic<T>,
    query: any,
    t?: Transaction
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      ObjectType.restore({ where: query, transaction: t })
        .then(() => {
          resolve(true);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   *
   *
   * @static
   * @param ObjectType
   * @param rule
   * @param t
   * @memberof BaseDAL
   */
  static bulk_restore = <T extends Model>(
    ObjectType: ModelStatic<T>,
    rule: any,
    t?: Transaction
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      ObjectType.restore({ where: rule, transaction: t })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  };
}

export default BaseDAL;
