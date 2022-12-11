import React, { Component } from 'react';
import Gallery from "react-image-gallery";
import Web3 from 'web3';
import './App.css';
import NFTDegrees from '../abis/NFTDegrees.json';
import Login from '../abis/Login.json';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Upload from './Upload';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {


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
    const web3acc = window.web3
    // const web3 = new Web3(new Web3.providers.HttpProvider(
    //   'https://ropsten.infura.io/v3/c047aaf9688c432fbb3e6c91526af532'
  // ));
    // Load account
    const accounts = await web3acc.eth.getAccounts()
    console.log("account=" + accounts[0])
    this.setState({ account: accounts[0] })
    const networkId = await web3acc.eth.net.getId()
    console.log("netID="+networkId)
    const networkData = NFTDegrees.networks[networkId]
    const networkDataLog = Login.networks[networkId]
    console.log("netDat="+networkData)
    if(networkData) {
      const contract = web3acc.eth.Contract(NFTDegrees.abi, networkData.address)//'0x35Ff32483DD531c6418CF150258476B8B334610C')//
      const Lcontract = web3acc.eth.Contract(Login.abi, networkDataLog.address)//'0x48Dfd4Fb7d29d54bEB70e90040e129cA5CFA2d84')//
      console.log("main con: " + contract)
      console.log("Log con: " + Lcontract)
      this.setState({ contract })
      this.setState({ Logcontract: Lcontract })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      imgHashes: [],
      Names: '',
      aNames: '',
      ID: null,
      aID: null,
      Qualification: '',
      University: '',
      results: [],
      sID: null,
      sNames: '',
      sQuali: '',
      sUni: '',
      scrit: '',
      addUniName: '',
      UniAddress:'',
      LoggedInName: '',
      searched: false,
      contract: null,
      Logcontract: null,
      web3: null,
      buffer: null,
      account: null,
      loggedIn: false,
      validator: false,
      triedLogin: false,
      noResults: true,
      alrAdded: false,
      noStudent: false
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleaNameChange = this.handleaNameChange.bind(this);
    this.handleUniversityChange = this.handleUniversityChange.bind(this);
    this.handleQualificationChange = this.handleQualificationChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleaIDChange = this.handleaIDChange.bind(this);
    this.getSearched = this.getSearched.bind(this);
    this.handleUniAddNameChange = this.handleUniAddNameChange.bind(this);
    this.handleUniAddChange = this.handleUniAddChange.bind(this);
  }

  handleUniAddNameChange(e) {
    this.setState({addUniName: e.target.value});
  }

  handleUniAddChange(e) {
    this.setState({UniAddress: e.target.value});
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

  handleaNameChange(e) {
    this.setState({aNames: e.target.value});
  }

  handleUniversityChange(e) {
    this.setState({University: e.target.value});
  }

  handleQualificationChange(e) {
    this.setState({Qualification: e.target.value});
  }

  handleIDChange(e) {
    this.setState({ID: e.target.value});
  }

  handleaIDChange(e) {
    this.setState({aID: e.target.value});
  }

  handleSearchChange(e) {
    this.setState({scrit: e.target.value});
  }


  onSubmit = (event) => {
    event.preventDefault()
    this.addNewDegree()
    // ipfs.add(this.state.buffer, (error, result) => {
    //   console.log('Ipfs result', result)
    //   if(error) {
    //     console.error(error)
    //     console.log("ERA")
    //     return
    //   }
    //    this.state.contract.methods.addDegree(this.state.ID, this.state.Qualification, this.state.University, result[0].hash).send({ from: this.state.account })
    // })
  }

  async addNewDegree() {
    console.log("ADDING NEW DEGREE")
    if (this.state.ID >= 0) {
      const r = await this.state.contract.methods.studentExists(this.state.ID).call()
      this.setState({ noStudent: !r })
      if (r) {
        ipfs.add(this.state.buffer, (error, result) => {
          console.log('Ipfs result', result)
          if(error) {
            console.error(error)
            console.log("ERA")
            return
          }
           this.state.contract.methods.addDegree(this.state.ID, this.state.Qualification, this.state.University, result[0].hash).send({ from: this.state.account })
        })
      }
    } else {
      this.setState({ noStudent: true })
    }
   
  }

  // onSubmitStu = (event) => {
  //   event.preventDefault()
  //   this.studentExists2(this.state.aID)
  //   console.log("ADDING")
  //   if (!this.state.alrAdded) {
  //     this.state.contract.methods.addStudent(this.state.aID, this.state.aNames).send({ from: this.state.account })
  //   }
  //   this.setState({ checked: false })
  // }

  onSubmitStu = (event) => {
    event.preventDefault()
    this.studentExists2()
  }

  onAddUniSubmit = (event) => {
    event.preventDefault()
    this.state.Logcontract.methods.addUni(this.state.addUniName, this.state.UniAddress).send({ from: this.state.account })
  }

  async search(name) {
    const contract = this.state.contract;
    if (this.state.scrit >= 0) {
      const r = await contract.methods.searchCount(this.state.scrit).call()
      console.log(r)
      const names = await contract.methods.studentName(this.state.scrit).call()
      const found = await contract.methods.search(this.state.scrit).call()
      console.log("name="+found)
      this.setState({ sNames: names })
      // contract.methods.inc(this.state.scrit).send({ from: this.state.account });
      // const sName = await contract.methods.getDegreeStudentName(0).call()
      this.setState({ results: found });
      // console.log("was it found? " + found[0]);
      let hashes = [];
      for (let i = 0; i < found[0]; i++) {
        hashes.push(await contract.methods.getDegreeImage(found[i+1]).call());
      }
      console.log("fetched: " + hashes)
      this.setState({ imgHashes: hashes })
    }
   
  }

  async studentExists(id) {
    const contract = this.state.contract;
    if (this.state.scrit >= 0) {
      const r = await contract.methods.studentExists(this.state.scrit).call()
      this.setState({ noResults: !r })
    } else {
      this.setState({ noResults: true })
    }
  }

  async studentExists2() {
    const contract = this.state.contract;
    if (this.state.aID >= 0) {
      const r = await contract.methods.studentExists(this.state.aID).call()
      console.log("Already added?" + r)
      this.setState({ alrAdded: r })
      if (!r) {
        this.state.contract.methods.addStudent(this.state.aID, this.state.aNames).send({ from: this.state.account })
        this.setState({ alrAdded: false })
      }
    } else {
      this.setState({ alrAdded: true })
    }

  }

  onSearch = (event) => {
    event.preventDefault()
    this.setState({ searched: true })
    console.log("Searching For: " + this.state.scrit)
    const web3 = window.web3
    this.search(this.state.scrit);
    this.studentExists(this.state.scrit)
  }

  async getName() {
    console.log("getting the name")
    let name = await this.state.Logcontract.methods.getName(this.state.account).call();
    this.setState({ LoggedInName: name })
  }

  async checkL() {
    const Lcontract = this.state.Logcontract;
    const web3 = window.web3
    console.log("Checking Account: " + this.state.account)
    const uni = await Lcontract.methods.checkLogin(this.state.account).call();
    console.log("Checking the log in " + uni)
    const val = await Lcontract.methods.checkValidator(this.state.account).call()
    console.log("Checking if validator: " + val)
    if (uni) {
      this.setState({ loggedIn:true })
    } else if (val) {
      this.setState({ validator:true })
    }
    this.setState({ triedLogin:true })
    this.getName()
  }

  Logging = (event) => {
    console.log("Clicked the log in button")
    event.preventDefault()
    this.checkL()
  }

  getSearched() {
    return this.state.searched;
  }
  
  addUniversity = (props) => {
    let test = props.props
    if(this.state.validator){
    return(<div><h2>Add University</h2>
      <form onSubmit={test.onSubmit} >
        <label >University Name:</label><br></br>
        <input type="text" id="UniName" name="Qualif" value={this.state.addUniName} onChange={this.handleUniAddNameChange}></input><br></br>
        <label >Address: </label><br></br>
        <input type="text" id="UniAdd" name="Uni" value={this.state.UniAddress} onChange={this.handleUniAddChange}></input><br></br>
        <input type='submit' />
      </form>
      </div>);}
      else {
        return <p></p>
      }
  }

  render() {

    let searched = this.state.searched;
    let nums = this.state.results;
    let imgs = this.state.imgHashes;
    let names = this.state.sNames;
    let loggedIn = this.state.loggedIn;
    let triedLogin = this.state.triedLogin;
    let validator = this.state.validator;
    let noRes = this.state.noResults
    let alrAdded = this.state.alrAdded
    let noStudent = this.state.noStudent

    function SearchTemplate(props) {
      console.log(nums + "are the results");
      let res = [];
      let hash;
      if (!noRes) {
        res.push(<div><h3 class="whiten">The Following Degrees are for:</h3></div>);
        res.push(<h4 class="whiten">{names}</h4>)
        for (let i = 0; i < nums[0]; i++) {
          res.push(<img className="pic" src={`https://ipfs.infura.io/ipfs/${imgs[i]}`} alt="" />);
        }
  
        return res;
      } else {
        return <h2 class="whiten">No Student Found!</h2>
      }
    }


    function Searched(props) {
      console.log("Has a search happened? " + searched)
      if (searched) {
        return <SearchTemplate />;
      }
      return <h2></h2>;
    }


    function LogButton(props) {
      console.log("check")
      if (triedLogin) {
        if (loggedIn) {
          let name = props.props.state.LoggedInName
          console.log("Maybe?")
          return <a style={{color:'white'}}>Logged in as {name}  </a>
        } else if (validator) {
          return <a style={{color:'white'}}>Logged in as Validator</a>
        } else {
          return <a style={{color:'white'}}>Invalid user!</a>
        }
      }
      return (<button onClick={props.props.Logging}>
      Login
      </button> )
    }

    function StudentAdded(props) {
      if (alrAdded) {
        return <p>Student already exists!</p>
      }
      return <p></p>
    }

    function StudentNotAdded(props) {
      if (noStudent) {
        return <p>Student does not exist!</p>
      }
      return <p></p>
    }

    return (
      <Router>
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              target="_blank"
              rel="noopener noreferrer"
              style={{color:"white"}}
              >
              Blockchain Degree Validation
            </a>
            <LogButton props={this}/>
          </nav>
          
          <Route path="/Upload" component={Upload} />
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                <form onSubmit={this.onSearch} >
                  <fieldset>
                    <label >Search for Student:</label><br></br>
                    <input type="number" id="Name" name="Names" value={this.state.scrit} onChange={this.handleSearchChange}></input>{/*<br></br>*/}
                    <input type='submit' />
                  </fieldset>
                  </form>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Searched />
                  </a>
                  <p>&nbsp;</p>
                  {validator ?
                  <div>
                    <fieldset>
                    <h2>Add University</h2>
                    <form onSubmit={this.onAddUniSubmit} >
                    <label >University Name:</label><br></br>
                    <input type="address" id="UniName" name="Qualif" value={this.state.addUniName} onChange={this.handleUniAddNameChange}></input><br></br>
                    <label >Address: </label><br></br>
                    <input type="text" id="UniAdd" name="Uni" value={this.state.UniAddress} onChange={this.handleUniAddChange}></input><br></br>
                    <input type='submit' />
                    </form>
                    </fieldset></div>
                    :
                    <p></p>
                  }
                  
                  {loggedIn ?
                  <div>
                    <fieldset>
                      <h2>Upload Degree</h2>
                  <form onSubmit={this.onSubmit} >
                  
                    <label >ID Number:</label><br></br>
                    <input type="number" id="id" name="ID" value={this.state.ID} onChange={this.handleIDChange}></input><br></br>
                    <label >Qualification</label><br></br>
                    <input type="text" id="Quali" name="Qualif" value={this.state.Qualification} onChange={this.handleQualificationChange}></input><br></br>
                    <label >University:</label><br></br>
                    <input type="text" id="Uni" name="Uni" value={this.state.University} onChange={this.handleUniversityChange}></input><br></br>
                    <p>&nbsp;</p>
                    <input type='file' onChange={this.captureFile} /><br></br>
                    <input type='submit' />
                    <StudentNotAdded />
                  </form>
                    </fieldset>
                <p>&nbsp;</p>
                  <fieldset>
                  <h2>Add Student</h2>
                  <form onSubmit={this.onSubmitStu} >
                    <label >Full Names:</label><br></br>
                    <input type="text" id="Name" name="Names" value={this.state.aNames} onChange={this.handleaNameChange}></input><br></br>
                    <label >ID Number:</label><br></br>
                    <input type="number" id="id" name="ID" value={this.state.aID} onChange={this.handleaIDChange}></input><br></br>
                    <input type='submit' />
                    <StudentAdded />
                  </form>
                    </fieldset>
                    </div>
                  :
                  <p></p>}

                  {/* <AddStudent props={this} /> */}
                  {/* <AddUniversity props={this} /> */}
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>

                </div>
              </main>
            </div>
          </div>
        </div>
        <footer>
        <div class="container-fluid padding footer">
          <div class="text-center padding">
            <div class="col-md padding whiten">
                  <p >BvdM4</p>
                  <p >Stellenbosch University</p>
                  </div>
              </div>
          </div>
        </footer>

      </Router>
    );
  }
}

export default App;
