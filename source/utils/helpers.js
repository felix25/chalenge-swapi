const axios = require('axios');

const BASE_URL_DEFAULT = 'https://swapi.py4e.com/api/people/';

const REPLACE_KEYS = {
  name: 'nombre',
  height: 'alto',
  mass:'masa',
  hair_color: 'color_cabello',
  skin_color: 'color_piel',
  eye_color: 'color_ojos',
  birth_year: 'fecha_nacimiento',
  gender: 'genero',
  homeworld: 'mundo_origen',
  films: 'peliculas',
  species: 'especies',
  vehicles: 'vehiculos',
  starships: 'naves_estelares',
  created: 'creado',
  edited: 'editado',
  url: 'url',
};

const exportData = async (url = BASE_URL_DEFAULT, method = 'get') => {
  try {
    const config = {
      method,
      url,
    };
    const { data } = await axios(config);
    return data;
  } catch (error) {
    throw error;
  }
};

const changeKeyObjects = (arr, replaceKeys) => {
  return arr.map(item => {
    const newItem = {};
    Object.keys(item).forEach(key => {
      newItem[replaceKeys[key]] = item[[key]];
    });
    return newItem;
  });
};

module.exports = {
  BASE_URL_DEFAULT,
  REPLACE_KEYS,
  exportData,
  changeKeyObjects
};