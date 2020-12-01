// SETUP
console.log('Project is running')

const e = require('express')
const express = require('express')
const shortid = require('shortid')
const server = express()

server.use(express.json())

// FAKE DATA
let users = [
    {
        id: shortid.generate(),
        name: 'Sterling Mount',
        bio: 'The Best Pupperoni'
    }
]

// HELPER FUNCTIONS
const User = {
    createNew(user) {
        const newUser = {
            ...user,
            id: shortid.generate()
        }
        users.push(newUser)
        return newUser
    },
    getAll() {
        return users
    },
    getById(id) {
        return users.find(user => user.id === id)
    },
    delete(id) {
        const user = users.find(u => u.id === id)
        if (user) {
            users = users.filter(u => u.id !== id)
        }
        return user
    },
    update(id, changes) {
        const user = users.find(u => u.id === id)
        if (user) {
            users = users.map(u => {
                if (u.id === id) {
                    return { id, ...changes }
                }
                return u
            })
            return { id, ...changes }
        }
        return null
    }
}

// ENDPOINTS
server.post('/api/users', (req, res) => {
    const clientUser = req.body
    if (!clientUser.name || !clientUser.bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
        return
    }
    const newUser = User.createNew(clientUser)
    if (newUser) {
        res.status(201).json(newUser)
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
})

server.get('/api/users', (req, res) => {
    // 1 - gather info from the request object
    // 2 - interact with db
    // 3 - send to client an appropriate response
    const users = User.getAll()
    if (users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({ errorMessage: 'The users information could not be retrieved.' })
    }
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params

    const user = User.getById(id)
    try {
        if (user === undefined) {
            res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
        } else {
            res.status(200).json(user)
        }
    } catch {
        res.status(500).json({ errorMessage: 'The user\'s information could not be retrieved.' })
    }
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params

    const user = User.getById(id)
    try {
        if (user === undefined) {
            res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
        } else {
            res.status(200).json(user)
        }
    } catch {
        res.status(500).json({ errorMessage: 'The user could not be removed.' })
    }
})

server.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        return
    }

    const { id } = req.params
    const user = User.update(id, req.body)

    try {
        if (user === null) {
            res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
            return
        }  
        else {
            res.status(200).json(user)
            return user
        }
    } catch {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
})

// CATCH ALL ENDPOINT
server.use('*', (req, res) => {
    res.status(404).json({ errorMessage: 'not found' })
})

// START THE SERVER
server.listen(5000, () => {
    console.log('listening on port 5000')
})