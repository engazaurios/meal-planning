export class Constants {

  public static imageContainer = 'menus';

  public static mealsTypes = {
    BREAKFAST: {
      key: 'breakfast'
    },
    LUNCH: {
      key: 'lunch'
    },
    DINNER: {
      key: 'dinner'
    }
  };

  public static mealConstants = Constants.toArray(Constants.mealsTypes);

  public static userTypes = {
    ADMIN: {
      key: 'admin'
    },
    EMPLOYEE: {
      key: 'employee'
    },
    PROVIDER: {
      key: 'provider'
    },
    GUEST: {
      key: 'guest'
    },
  };

  public static adminUserTypes = [Constants.userTypes.ADMIN.key];
  public static providerUserTypes = [Constants.userTypes.PROVIDER.key];
  public static nonAdminUserTypes = [Constants.userTypes.EMPLOYEE.key, Constants.userTypes.GUEST.key];

  /**
   * Dictionary of display types.
   */
  public static displayTypes = {
    DAY: {
      key: 'day',
      title: 'Día'
    },
    WEEK: {
      key: 'week',
      title: 'Semana'
    },
    MONTH: {
      key: 'month',
      title: 'Mes'
    },
    YEAR: {
      key: 'year',
      title: 'Año'
    }
  };

  /**
   * Dictionary of daymenu status.
   */
  public static statusTypes = {
    NA: {
      key: 'NA',
      message: 'No disponible'
    },
    SENT: {
      key: 'SENT',
      message: 'Enviado'
    },
    PENDING: {
      key: 'PENDING',
      message: 'Pendiente'
    },
    OPEN: {
      key: 'OPEN',
      message: 'Disponible'
    },
    APPROVED: {
      key: 'APPROVED',
      message: 'Aprobado'
    }
  };

  public static toArray(dictionary) {
    const dictionaryArray = [];
    Object.keys(dictionary).forEach((key) => {
      dictionaryArray.push(dictionary[key].key);
    });
    return dictionaryArray;
  }

}
