export class Constants {

  public static breakfastKey = {key: 'breakfast', priority: 1};
  public static lunchKey = {key: 'lunch', priority: 2};
  public static dinnerKey = {key: 'dinner', priority: 3};

  public static mealConstants = [Constants.breakfastKey.key, Constants.lunchKey.key, Constants.dinnerKey.key];

  public static statusKey = {
    NA: 'No disponible',
    SENT: 'Enviado',
    PENDING: 'Pendiente',
  };
}
