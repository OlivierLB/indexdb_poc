import React, {Component} from 'react';
import {getNegociationAllocate, getNegociationAllocateExport} from "../Services/StyleColor";
import Dexie from "dexie";
import {getSeasons} from "../Services/Season";

export class Cmd extends Component {


  eraseDB() {
    indexedDB.deleteDatabase('CWFDatabase');
  }

  async getExcel() {
    await getSeasons().then(async (result) => {
      await getNegociationAllocateExport(result.data["hydra:member"][2].id, '?page=1&itemsPerPage=50')
        .then((result) => {
         console.log(result)
        });
    });
  }

  async getData(){
    await getSeasons().then(async (result) => {
      await getNegociationAllocate(result.data["hydra:member"][2].id, '?page=1&itemsPerPage=50')
        .then((result) => {
          var db = new Dexie("CWFDatabase");
          db.version(1).stores({
            negociations: "id,brand_code,style_color_code,style_color_label,commercial_delay,style_marketing_volume,buy_times"
          });
          result.data['hydra:member'].map(async (r) => {
            await db.negociations.add({
              id: r.id,
              brand_code: r.brand_code,
              style_color_code: r.style_color_code,
              style_color_label: r.style_color_label,
              commercial_delay: r.commercial_delay,
              style_marketing_volume: r.style_marketing_volume,
              buy_times: r.buy_times
            })
          })
        });
    });
  }

  render() {
    return(
      <>
        <button onClick={() => this.getExcel()}>getExcel</button>
        <button onClick={() => this.eraseDB()}>DeleteDB</button>
        <button onClick={() => this.getData()}>LoadDB</button>
      </>
    );
  }
}