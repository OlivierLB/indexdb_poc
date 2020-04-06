import React, {Component} from 'react';
import Dexie from 'dexie';
import {getBrands} from "../Services/Brand";

export class Wow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      negociations: [],
      brands: [],
      filtreBrand : ""
    };
    this.onSelect = this.onSelect.bind(this);
  }

   componentDidMount() {
     this.renderNegociations();
  }

  componentWillMount() {
    getBrands().then((r) => (
      this.setState({brands: r.data['hydra:member']})
    ))
  }

  onSelect(e){
    this.setState({filtreBrand: e.target.value})
    this.renderNegociations()
  }

  // Calculate intersection of multiple array or object values.
  intersect (arrList) {
    var arrLength = Object.keys(arrList).length;
    // (Also accepts regular objects as input)
    var index = {};
    for (var i in arrList) {
      for (var j in arrList[i]) {
        var v = arrList[i][j];
        if (index[v] === undefined) index[v] = {};
        index[v][i] = true; // Mark as present in i input.
      };
    };
    var retv = [];
    for (var i in index) {
      if (Object.keys(index[i]).length == arrLength) retv.push(i);
    };
    return retv;
  };


  renderNegociations() {

    let db = {}
     Dexie.exists('CWFDatabase').then(async(exists) => {
      if (exists) {
        db = await new Dexie("CWFDatabase").open();
        db.tables.map(async table => {
          
          const promises = []
          promises.push(table.where('style_color_code').anyOf("J04298/M41", "D35N59/N48").primaryKeys());
          promises.push(table.where('style_color_label').anyOf( "TEE-SHIRT MANCHES COURTES BLANC BLEU").primaryKeys());
          console.log(this.state.filtreBrand !== '');
          if(this.state.filtreBrand !== '')promises.push( table.where('brand_code').anyOf(this.state.filtreBrand).primaryKeys());
          const keys = await Promise.all(promises);
          //var intersection = keys[0].filter(key => keys[1].indexOf(key) !== -1);
          var intersection = this.intersect(keys);
          table.where('id').anyOf(intersection).toArray().then((r) => {
              this.setState({negociations:
                  r.map((n, i) => (
                    <tr key={i}>
                      <td>{n.id}</td>
                      <td>{n.brand_code}</td>
                      <td>{n.style_color_code}</td>
                      <td>{n.style_color_label}</td>
                      <td>{n.commercial_delay}</td>
                      <td>{n.style_marketing_volume}</td>
                    </tr>
                    ))
                  })
                })
          })
      }
    });
    return db;
  }

  render() {
    const { negociations, brands } = this.state;

  return(
    //id,brand_code,style_color_code,style_color_label,commercial_delay,style_marketing_volume,buy_times
    <>
      <div>
        <div>
          <select onChange={(e) => this.onSelect(e)}>
            {
              brands && brands.map((brand, key) => {
                return (
                    <option key={key} value={brand.code}>
                      {brand.label}
                    </option>
                  );
              })
            }
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>brand_code</th>
              <th>style_color_code</th>
              <th>style_color_label</th>
              <th>commercial_delay</th>
              <th>style_marketing_volume</th>
            </tr>
          </thead>
          <tbody>
            {negociations}
          </tbody>
        </table>
      </div>
    </>
  );
  }
}