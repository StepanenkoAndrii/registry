const db = require('../db');

class UserController {
    async getPersons(req, res) {
        const persons = await db.query('select * from persons');
        res.json(persons.rows);
    }
}

module.exports = new UserController();