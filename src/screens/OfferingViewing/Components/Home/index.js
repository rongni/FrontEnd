import React from 'react'
// UI
import SearchBar from './SearchBar';
import Filter from  './Filter'
import OfferingList from './OfferingList'
import './index.css'
// Vars
import { user, api, search } from '../../../../util'

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',

      universities: [],
      terms: [],
      departments: [],
      courses: [],
      offerings: [],

      departSelected: [],
      termSelected: [],

      onSearching: false,
      searchValue: '',
    }
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    if (user.isLoggedIn()) {
      user.setUpUser(this.getOfferingsByStudentId)
    } else {
      api.getAll(['Offerings'], this.getAllCallBack)
    }
    api.getAll(['Universities', 'Departments', 'Terms'], this.getAllCallBack)
  }

  /**
   * GET functions for set states
   */
  getOfferingsByStudentId = userId => {
    this.setState({ userId })
    api.getOfferingsByStudentId(userId)
      .then( ({data}) => {
        console.log(data)
        this.setState({ offerings: data })
        this.completeOfferings(data)
      })
  }
  completeOfferings = rawOfferings => {
    // rawOfferings = handleData.shuffle(rawOfferings)
    rawOfferings.forEach( (offering, index) => {
      // get courseOffering by offering id
      api.getData('Offerings', offering.id)
        .then(response => {
          const courseOffering = response.data
          // set id for future use
          courseOffering.id = courseOffering.offering.id
          // get department acronym
          courseOffering.courses.forEach( course => {
            api.getData('Departments', course.departmentId) 
              .then( ({data}) => {
                course.acronym = data.acronym
                const { offerings } = this.state
                offerings[index] = courseOffering
                this.setState({ offerings })
              })
          })
          // get term name
          api.getData('Terms', courseOffering.offering.termId)
            .then(({data}) => {
              courseOffering.offering.termName = data.name
              const { offerings } = this.state
              offerings[index] = courseOffering
              this.setState({ offerings })
            })
          // const { offerings } = this.state
          // offerings[index] = courseOffering
          // this.setState({ offerings })
        })
    })
  }
  getDepartmentsByUniId = uniId => {
    api.getDepartsByUniId(uniId)
     .then(({data}) => {
        // data = handleData.shuffle(data)
        this.setState({ departments: data, departSelected: [] })
     })
  }
  getTermsByUniId = uniId => {
    api.getTermsByUniId(uniId)
      .then(({data}) => {
        this.setState({ terms: data, termSelected: [] })
      })
  }

  getAllCallBack = ({data}, stateName) => {
    if (stateName === 'offerings') {
      this.completeOfferings(data)
      // api.contentLoaded()
    } else if (stateName === 'departments') {
      // data = handleData.shuffle(data)
    }
    this.setState({[stateName]: data})
  }

  onSearching = () => {
    const { onSearching } = this.state
    search.displaySearchBar(onSearching)
    this.setState({ onSearching: !onSearching})
  }
  onInput = e => {
    // console.log(e.target.value)
    this.setState({searchValue: e.target.value})
  }

  onUniSelected = (e, {value}) => {
    if (!value) {
      api.getAll(['Departments', 'Terms'], this.getAllCallBack)
      // this.setState({ departments: [], terms: [] })
    } else {
      this.getDepartmentsByUniId(value)
      this.getTermsByUniId(value)
    }
  }

  onDepartSelected = (e, {value}) => {
    this.setState({ departSelected: value })
  }

  onTermSelected = (e, {value}) => {
    this.setState({ termSelected: value })
  }

  render() {
    return (
      <div className="sp-home">
        <SearchBar {...this} />
        <div id="home-content">
          <Filter {...this} />
          <OfferingList {...this} />
        </div>
      </div>
    )
  }
}