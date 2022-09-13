const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://jjbriasco:${password}@cluster0.4idglrg.mongodb.net/people?retryWrites=true&w=majority`


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    mongoose.connect(url)
    
    Person.find({}).then(res => {
        res.forEach(person => console.log(person))
        mongoose.connection.close()
    })
}

if(process.argv.length === 4){
    console.log('If you want to add a new contact, use: node mongo.js <password> <name> <number> in the terminal')
    process.exit(1)
}

if(process.argv.length === 5) {
    const person = new Person({name: process.argv[3], number: process.argv[4],}) 
    
    mongoose.connect(url)
    person.save().then(res => {
        console.log('contact saved!')
        mongoose.connection.close()
    })
}





