const AuthRepository = require('../repositories/AuthRepository');
const authRepository = new AuthRepository();

module.exports = {
    async getRegData(req, res) {
        const institutions = await authRepository.getInstitutions();
        const positions = await authRepository.getPositions();
        const issues = await authRepository.getIssues();
        res.render('registration', {institutions: institutions.rows, positions: positions.rows, issues: issues.rows});
    },

    async addAdmin(req, res) {
        const error = await authRepository.getErrorMessage(req.body, 2);
        if (error !== "") {
            const institutions = await authRepository.getInstitutions();
            const positions = await authRepository.getPositions();
            const issues = await authRepository.getIssues();
            res.render('registration', {errorMessage: error, institutions: institutions.rows, positions: positions.rows, issues: issues.rows});
            return;
        }
        const added = await authRepository.addAdmin(req.body);
        if (added) {
            res.render('login', {params: req.body.login});
        }
        else {
            res.redirect('/error');
        }
    },

    async getLoginData(req, res) {
        const error = await authRepository.getErrorMessage(req.body, 1);
        if (error !== "") {
            res.render('login', {errorMessage: error, params: req.body.login});
            return;
        }
        const user = await authRepository.getLoginData(req.body);
        if (user.rowCount > 0) {
            const newCurrentPerson = await authRepository.addCurrentPerson(user.rows[0].id);
            res.redirect('/forms');
        }
    },

    async logout(req, res) {
        console.log('here1');
        const deletedCurrentPerson = await authRepository.deleteCurrentPerson();
        console.log('here');
        res.redirect('/');
    },
}