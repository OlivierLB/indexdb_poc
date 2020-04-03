import React, {Component} from 'react';
import {getNegociationAllocate} from "../Services/StyleColor";
import Dexie from "dexie";

export class Cmd extends Component {


  eraseDB() {
    indexedDB.deleteDatabase('CWFDatabase');
  }

  async getData(){
    await getNegociationAllocate('456DB8B3-DC5C-4FA3-BDB6-969F6DA914EC', '?page=1&itemsPerPage=50')
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
  }

  render() {
    return(
      <>
        <button onClick={() => this.eraseDB()}>DeleteDB</button>
        <button onClick={() => this.getData()}>LoadDB</button>
      </>
    );
  }
}