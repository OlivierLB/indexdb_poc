import React, {Component} from 'react';
import Dexie from 'dexie';
import {getBrands} from "../Services/Brand";

export class Wow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      negociations: [],
      brands: []
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
    console.log(e.target.value)
  }

  renderNegociations() {

    let db = {}
     Dexie.exists('CWFDatabase').then(async(exists) => {
      if (exists) {
        db = await new Dexie("CWFDatabase").open();
        db.tables.map(table => {
          table.toArray()
            .then((r) => {
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