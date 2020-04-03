import {application as API } from './api.js';

export function getNegociationAllocate(id, filtre = ''){
  return API.get(`/style_colors/negociation_allocate/${id}${filtre}`);
}