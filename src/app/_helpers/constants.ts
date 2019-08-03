export class Constants {

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
    GUEST: {
      key: 'guest'
    },
  };

  public static adminUserTypes = [Constants.userTypes.ADMIN.key];
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
      key: 'na',
      message: 'No disponible'
    },
    SENT: {
      key: 'sent',
      message: 'Enviado'
    },
    PENDING: {
      key: 'pending',
      message: 'Pendiente'
    },
    OPEN: {
      key: 'open',
      message: 'Disponible'
    },
    APPROVED: {
      key: 'approved',
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
