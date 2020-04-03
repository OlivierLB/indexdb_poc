import {application as API } from './api.js';

export function getBrands(filtre = '?pagination=false'){
  return API.get(`/brands${filtre}`);
}