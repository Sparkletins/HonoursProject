const { assert } = require('chai')

const NFTDegrees = artifacts.require('./NFTDegrees.sol')
const Login = artifacts.require('./Login.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NFTDegree', (accounts) => {
  let contract

  before(async () => {
    contract = await NFTDegrees.deployed()
  })

  describe('Deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Degrees')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'DEGREES')
    })

   })

   describe('Add a student', async () => {

    it('Add one new student', async () => {
      await contract.addStudent(0, "James West")
      const name = await contract.studentName(0)
      assert.equal("James West", name)
    })
  })

  describe('Minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.addDegree(0, "", "", "EC058E")
      const totalSupply = await contract.Count()
      // SUCCESS
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      //console.log(event) shows more information about the minting of tokens
      assert.equal(event.tokenId.toNumber(), 0, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same color twice
      await contract.addDegree(0, "", "", "EC058E").should.be.rejected;
    })
  })

  describe('Indexing', async () => {
    it('lists Degrees', async () => {
      // Mint 3 more tokens
      await contract.addDegree(0, "", "", '#5386E4')
      await contract.addDegree(0, "", "", '#FFFFFF')
      await contract.addDegree(0, "", "", '#000000')
      const totalSupply = await contract.Count()

      let DegreeImage
      let result = []

      for (var i = 0; i < totalSupply; i++) {
        DegreeImage = await contract.getDegreeImage(i)
        result.push(DegreeImage)
      }

      let expected = ['EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(result.join(','), expected.join(','))
    })
  })

  describe('Token ownership', async () => {
    it('Correct initial Degrees owners', async () => {
      let DegreeOwner
      const totalSupply = await contract.Count()
      for (var i = 0; i < totalSupply; i++) {
        DegreeOwner = await contract.owner(i)
        assert.equal('0x40a2E9696593AB6a90FFa26350eA01333F33Ba17', DegreeOwner)
      }
    })

    it('Correctly change Degrees owners', async () => {
      let newOwner = "0x814dfED818a92E8AAa1aB5461D420b259324c8ed"
      const totalSupply = await contract.Count()
      DegreeOwner = await contract.owner(1)
      assert.equal('0x40a2E9696593AB6a90FFa26350eA01333F33Ba17', DegreeOwner)
      await contract.transfer(1, newOwner)
      DegreeOwner = await contract.owner(1)
      assert.equal(newOwner, DegreeOwner)

    })
  })

  describe('Additional tests', async () => {
    it('Correct number of degrees added to student', async () => {
      const degs = await contract.searchCount(0)
      assert.equal(degs, 4)
    })

  })

})

/*Login tests*/

contract('Login', (accounts) => {
  let contract

  before(async () => {
    contract = await Login.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('validator set', async () => {
      let validator = await contract.checkValidator('0x40a2E9696593AB6a90FFa26350eA01333F33Ba17')
      assert.isTrue(validator)
    })

   })

   describe('Add a University', async () => {

    it('Add one new University', async () => {
      let receipt = await contract.addUni("Stellenbosch University", '0xdb80FBEA9AC0513D82db76ce178dE4372B99B65a')
      const gasUsed = receipt.receipt.gasUsed;
      console.log(`GasUsed: ${receipt.receipt.gasUsed}`);
      const loginCheck = await contract.checkLogin('0xdb80FBEA9AC0513D82db76ce178dE4372B99B65a')
      assert.isTrue(loginCheck)
    })

    it('Check proper name', async () => {
      await contract.addUni("Stellenbosch University", '0xdb80FBEA9AC0513D82db76ce178dE4372B99B65a')
      let res = await contract.getName('0xdb80FBEA9AC0513D82db76ce178dE4372B99B65a')
      assert.equal(res, "Stellenbosch University")
    })

  })

  describe('Add a University', async () => {

    it('Add one new University', async () => {
      await contract.addUni("Stellenbosch University", '0xdb80FBEA9AC0513D82db76ce178dE4372B99B65a')
      const loginCheck = await contract.checkLogin('0xdb80FBEA9AC0513D82db76ce178dE4372B99B65a')
      assert.isTrue(loginCheck)
    })

  })

  

  


})
