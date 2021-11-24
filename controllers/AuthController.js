const AuthRepository = require('../repositories/AuthRepository');
const authRepository = new AuthRepository();
const FormRepository = require('../repositories/FormRepository');
const formRepository = new FormRepository();

module.exports = {
    async getRegData(req, res) {
        const institutions = await authRepository.getInstitutions();
        const positions = await authRepository.getPositions();
        const issues = await authRepository.getIssues();
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('registration', {institutions: institutions.rows, positions: positions.rows,
                issues: issues.rows, login: "", role: "admin", isRegistrator: false});
            return;
        }
        res.render('registration', {institutions: institutions.rows, positions: positions.rows, issues: issues.rows,
            role: currentPerson.rows[0].role === "Адміністратор" ? "registrator" : ""});
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

    async addRegistrator(req, res) {
        const error = await authRepository.getErrorMessage(req.body, 3);
        if (error !== "") {
            const institutions = await authRepository.getInstitutions();
            const positions = await authRepository.getPositions();
            const issues = await authRepository.getIssues();
            res.render('registration', {errorMessage: error, institutions: institutions.rows, positions: positions.rows, issues: issues.rows});
            return;
        }
        const added = await authRepository.addRegistrator(req.body);
        if (added) {
            const registrators = await formRepository.getRegistrators();
            res.render('registrators', {registrators: registrators.rows});
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
        console.log(user.rows[0]);
        if (user.rowCount > 0) {
            const newCurrentPerson = await authRepository.addCurrentPerson(user.rows[0].id);
            res.redirect('/forms');
        }
    },

    async logout(req, res) {
        const deletedCurrentPerson = await authRepository.deleteCurrentPerson();
        res.redirect('/');
    },
}