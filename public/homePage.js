"use strics";

let logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success === true){
            location.reload();
        } else {
            console.error(response.error);
        }
    });
};

let current = ApiConnector.current((response) => {
    if (response.success === true){
        ProfileWidget.showProfile(response.data);
    } else {
        console.error('Ошибка профиля' + response.error);
    }
});

let ratesBoard = new RatesBoard();

function getCurrency() {
    ApiConnector.getStocks((response) => {
        if (response.success === true){
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        } else {
            console.error('Ошибка получения');
        }
    });
};
getCurrency();

setInterval(getCurrency(),60000);

let moneyManager = new MoneyManager();
// пополнение баланса
moneyManager.addMoneyCallback = ((data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success === true){
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Баланс пополнен');
        } else {
            moneyManager.setMessage(false, "Ошибка пополнения");
        };
    });
});

// конвертация

moneyManager.conversionMoneyCallback = ((data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'конвертация успешна');
        } else {
            moneyManager.setMessage(false, 'ошибка конвертации');
        };
    });
});

// перевод валюты

moneyManager.sendMoneyCallback = ((data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.moneyManager(true, 'перевод завершен');
        } else {
            moneyManager.moneyManager(false,'ошибка перевода');
        };
    });
});

// избранное

 let favoritesWidget = new FavoritesWidget();

 ApiConnector.getFavorites = ((response) => {
     if (response.success === true){
         favoritesWidget.clearTable();
         favoritesWidget.fillTable(response.data);
         moneyManager.updateUsersList(response.data);
     };
 });

 favoritesWidget.addUserCallback = ((data) => {
     ApiConnector.addUserToFavorites(data, (response) => {
         if (response.success === true){
             favoritesWidget.clearTable();
             favoritesWidget.fillTable(response.data);
             moneyManager.updateUsersList(response.data);
             favoritesWidget.setMessage(true, 'успешно добавлен');
         } else {
             favoritesWidget.setMessage(false, 'ошибка добавления');
         };
     });
 });

favoritesWidget.removeUserCallback = ((data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success === true){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'пользователь удален');
        } else {
            favoritesWidget.setMessage(false, 'ошибка удаления из избранного' + response.error);
        };
    });
});

