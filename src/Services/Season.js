import {application as API } from './api.js';

export function getSeasons(){
  return API.get(`/seasons`);
}