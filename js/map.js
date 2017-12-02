// setup.js
'use strict';

// Количество объявлений
var adsQuantity = 8;

// Объявляем массив объявлений
var ads = [];

// Здесь храгим данные для генерации объявлений
var variantsOfTitle = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный ' +
'прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый ' +
'негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var variantsOfPriceMin = 1000;
var variantsOfPriceMax = 1000000;
var variantsOfType = ['flat', 'house', 'bungalo'];
var variantOfRoomsMin = 1;
var variantOfRoomsMax = 5;
var variantsOfGuestsMin = 1;
var variantsOfGuestsMax = 10;
var variantsOfCheckinCheckout = ['12:00', '13:00', '14:00'];
var variantsOfLocationXMin = 300;
var variantsOfLocationXMax = 900;
var variantsOfLocationYMin = 100;
var variantsOfLocationYMax = 500;
var variantsOfFeature = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// Смещения для нахождения кончика метки
var mapMarkerXOffset = 28; // 56 - ширина, делим на два 28. Но получается кончик смещается на 1рх - это номр?
var mapMarkerYOffset = 75;

// Генерируем случайнео целое число от минимума до максимума
var randomiseIntegerMinToMax = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция выбора случайных элеменов массива
var chooseRandomArrElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Функция урезания массива
var generateFeatures = function (arr) {
  return arr.slice(0, randomiseIntegerMinToMax(0, arr.length));
};


// 1. Создаем массив случайных объявлений
for (var i = 0; i < adsQuantity; i++) {
  ads[i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      title: variantsOfTitle[i],
      address: '',
      price: randomiseIntegerMinToMax(variantsOfPriceMin, variantsOfPriceMax),
      type: chooseRandomArrElement(variantsOfType),
      rooms: randomiseIntegerMinToMax(variantOfRoomsMin, variantOfRoomsMax),
      guests: randomiseIntegerMinToMax(variantsOfGuestsMin, variantsOfGuestsMax),
      checkin: chooseRandomArrElement(variantsOfCheckinCheckout),
      checkout: chooseRandomArrElement(variantsOfCheckinCheckout),
      features: generateFeatures(variantsOfFeature),
      description: '',
      photos: []
    },
    location: {
      x: randomiseIntegerMinToMax(variantsOfLocationXMin, variantsOfLocationXMax),
      y: randomiseIntegerMinToMax(variantsOfLocationYMin, variantsOfLocationYMax)
    }
  };
  ads[i].offer.address = ads[i].location.x + ', ' + ads[i].location.y;
}

// 2. У блока .map убираем .map--faded
var mapBlock = document.querySelector('.map');
mapBlock.classList.remove('map--faded');


// 3. Создаем и заполняем DOM элемент

// Функция генерации фрагмента
var createMapMarkerElement = function (arr, offsetX, offsetY) {
  var newElement = document.createElement('button');
  newElement.style.left = (arr.location.x - offsetX) + 'px';
  newElement.style.top = (arr.location.y - offsetY) + 'px';
  newElement.className = 'map__pin';
  newElement.innerHTML = '<img src="' + arr.author.avatar + '" width="40" height="40" draggable="false">';
  return newElement;
};

// Создаем фрагмент для оптимизации
var mapMarkerFragment = document.createDocumentFragment();

// Генерируем фрагмент
for (var j = 0; j < adsQuantity; j++) {
  mapMarkerFragment.appendChild(createMapMarkerElement(ads[j], mapMarkerXOffset, mapMarkerYOffset));
}
// 4. Отрисовываем в .map__pins
// Находим куда рисовать
var mapMarker = document.querySelector('.map__pins');

// Отрисовываем фрагмент там, где надо;)
mapMarker.appendChild(mapMarkerFragment);

// 5.
// Функция перевода типа фич на русский язык;)
var translateOfferType = function (offerType) {
  if (offerType === 'flat') {
    return 'Квартира';
  } else if (offerType === 'bungalo') {
    return 'Бунгало';
  } else if (offerType === 'house') {
    return 'Дом';
  } else {
    return 'Незивестно что';
  }
};

// Используем шаблон
var similarLodgeTemplate = document.querySelector('template').content.querySelector('.map__card');

// функция генерации фич
var generateFeatureSpan = function (arr) {
  var newElement = document.createElement('li');
  newElement.className = 'feature feature--' + arr;
  return newElement;
};

// Функция геренарции фрагмента
var createDialogPanelFragment = function (arr) {
  var element = similarLodgeTemplate.cloneNode(true);
  element.querySelector('h3').textContent = arr.offer.title;
  element.querySelector('p small').textContent = arr.offer.address;
  element.querySelector('.popup__price').textContent = arr.offer.price + ' ₽/ночь';
  element.querySelector('h4').textContent = translateOfferType(arr.offer.type);
  var paragraphOfElement = element.querySelectorAll('p');
  paragraphOfElement[2].textContent = arr.offer.rooms + ' для ' +
    arr.offer.guests + ' гостей';
  paragraphOfElement[3].textContent = 'Заезд после ' + arr.offer.checkin +
    ', выезд до ' + arr.offer.checkout;
  var listPopupFeatures = element.querySelector('.popup__features');
  while (listPopupFeatures.firstChild) {
    listPopupFeatures.removeChild(listPopupFeatures.firstChild);
  }
  for (var k = 0; k < arr.offer.features.length; k++) {
    listPopupFeatures.appendChild(generateFeatureSpan(arr.offer.features[k]));
  }
  paragraphOfElement[4].textContent = arr.offer.description;

  // Меняе SRC....
  element.querySelector('.popup__avatar').setAttribute('src', arr.author.avatar);
  return element;
};


// Создаем фрагмент для оптимизации
var dialogPanelFragment = document.createDocumentFragment();

// Генерируем фрагмент
dialogPanelFragment.appendChild(createDialogPanelFragment(ads[0]));

// Заменяем диалог на фрагмент
var dialogPanel = document.querySelector('.map');
var mapFiltersConteiner = document.querySelector('.map__filters-container')
dialogPanel.insertBefore(dialogPanelFragment, mapFiltersConteiner);
