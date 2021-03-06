import React, { Component } from 'react'
import {Pagination, Row} from 'react-bootstrap'
import ListProductComponent from './sub-components/ListProductComponent'
import alt from '../alt'
import AllProductsStore from '../stores/AllProductsStore'
import AllProductsActions from '../actions/AllProductsActions'
import queryString from 'query-string'
import history from '../history'
import SingleProductActions from '../actions/SingleProductActions'

class RemovedProductsComponent extends Component {
  constructor (props) {
    super(props)
    this.state = AllProductsStore.getState()
    this.onChange = this.onChange.bind(this)
    this.page = Number(queryString.parse(history.location.search).page) || 1
  }

  componentDidMount () {
    AllProductsStore.listen(this.onChange)
    AllProductsActions.getOnePageRemovedProducts(this.page)
  }

  componentWillUnmount () {
    alt.recycle(AllProductsStore)
    AllProductsStore.unlisten(this.onChange)
  }

  onChange (state) {
    this.setState(state)
  }

  handleSelect (page) {
    if (history.location.search !== `?page=${page}`) {
      history.push(`?page=${page}`)
      AllProductsActions.getOnePageRemovedProducts(page)
    }
  }

  render () {
    let products = this.state.products.map(product => {
      return (<ListProductComponent showUnDelete onUnDelete={SingleProductActions.unDeleteProduct} key={product._id} product={product} />)
    })
    return (
      <div className='container remove-navbar-margin'>
        <h4 className='text-center'>Hidden products</h4>
        {products}
        <Row>
          <div className='fit-content center-block'>
            <Pagination prev next first last ellipsis boundaryLinks
              items={this.state.pagesCount}
              maxButtons={3}
              activePage={this.state.activePage}
              onSelect={this.handleSelect} />
          </div>
        </Row>
      </div>
    )
  }
}
export default RemovedProductsComponent
