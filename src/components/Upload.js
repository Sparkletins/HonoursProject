import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Degrees from '../abis/Degrees.json';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import App from './App';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class Upload extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Degrees.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Degrees.abi, networkData.address)
      this.setState({ contract })
      const imgHash = await contract.methods.getDegreeImage(0).call()
      const sName = await contract.methods.getDegreeStudentName(0).call()
      console.log("name="+sName);
      this.setState({ imgHash });
      this.setState({sNames: sName});
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      imgHashes: [],
      Names: '',
      Qualification: '',
      University: '',
      results: [],
      sNames: '',
      sQuali: '',
      sUni: '',
      scrit: '',
      searched: false,
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUniversityChange = this.handleUniversityChange.bind(this);
    this.handleQualificationChange = this.handleQualificationChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getSearched = this.getSearched.bind(this);
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  handleNameChange(e) {
    this.setState({Names: e.target.value});
  }

  handleUniversityChange(e) {
    this.setState({University: e.target.value});
  }

  handleQualificationChange(e) {
    this.setState({Qualification: e.target.value});
  }

  handleSearchChange(e) {
    this.setState({scrit: e.target.value});
  }


  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    console.log(this.state.Names)
    console.log(this.state.University)
    console.log(this.state.Qualification)
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
       this.state.contract.methods.addDegree(this.state.Names,this.state.Qualification, this.state.University, result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ imgHash: result[0].hash })
       })
    })
  }

  async search(name) {
    const contract = this.state.contract;
    const found = await contract.methods.search(this.state.scrit).call()
      // const sName = await contract.methods.getDegreeStudentName(0).call()
    this.setState({ results: found });
    console.log("was it found? " + found[0]);
    let hashes = [];
    for (let i = 0; i < found[0] ; i++) {
      hashes.push(await contract.methods.getDegreeImage(found[i + 1]).call());
    }
    console.log("fetched: " + hashes)
    this.setState({ imgHashes: hashes })
  }

  onSearch = (event) => {
    event.preventDefault()
    this.setState({ searched: true })
    console.log("Searching For: " + this.state.scrit)
    const web3 = window.web3
    this.search(this.state.scrit);
  }

  getSearched() {
    return this.state.searched;
  }
  

  render() {

    let searched = this.state.searched;
    let nums = this.state.results;
    let imgs = this.state.imgHashes;

    function SearchTemplate(props) {
      console.log(nums + "are the results");
      let res = [];
      let hash;
      for (let i = 0; i < nums[0]; i++) {
        console.log("The hash:" + imgs[i])
        res.push(<img src={`https://ipfs.infura.io/ipfs/${imgs[i]}`} alt=""/>);
      }

      return res;
    }

    function Searched(props) {
      console.log("Has a search happened? " + searched)
      if (searched) {
        return <SearchTemplate />;
      }
      return <h2>No Results</h2>;
    }

    return (
      <Router>
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Veritas
                  {/* <Route path="/" component={App} />
                  <Link to="/"> Home</Link>
                  <Link to="/Upload"> Upload</Link> */}

            </a>
          </nav>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  </a>
                  <p>&nbsp;</p>
                  <h2>Upload degree</h2>
                  <form onSubmit={this.onSubmit} >
                    <label >Full Names:</label><br></br>
                    <input type="text" id="Name" name="Names" value={this.state.Names} onChange={this.handleNameChange}></input><br></br>
                    <label >Qualification</label><br></br>
                    <input type="text" id="Quali" name="Qualif" value={this.state.Qualification} onChange={this.handleQualificationChange}></input><br></br>
                    <label >University:</label><br></br>
                    <input type="text" id="Uni" name="Uni" value={this.state.University} onChange={this.handleUniversityChange}></input><br></br>
                    <input type='file' onChange={this.captureFile} /><br></br>
                    <input type='submit' />
                  </form>
                </div>
              </main>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Upload;
