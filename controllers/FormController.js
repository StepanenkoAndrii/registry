const FormRepository = require('../repositories/FormRepository');
const formRepository = new FormRepository();

module.exports = {
    async getForms(req, res) {
        // console.log("fdhf");
        const forms = await formRepository.getForms();
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        console.log("tyt");
        res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getFilteredForms(req, res) {
        const forms = await formRepository.getFilteredForms(req.query.usage_date, req.query.series, req.query.number,
            req.query.name, req.query.surname, req.query.middle_name, req.query.status);
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getFormById(req, res) {
        const form = await formRepository.getFormById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('form', {form: form.rows[0], login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('form', {form: form.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getHomePage(req, res) {
        const currentPerson = await formRepository.getCurrentPerson();
        // console.log(currentPerson);
        if (currentPerson.rowCount === 0) {
            res.render('home', {login: "", role: ""});
            return;
        }
        res.render('home', {login: currentPerson.rows[0].login, role: currentPerson.rows[0].role});
    },

    async getFormsData(req, res) {
        // console.log("here");
        const logins = await formRepository.getLogins();
        const statuses = await formRepository.getStatuses();
        res.render('newForm', {logins: logins.rows, statuses: statuses.rows});
    },

    async addForm(req, res) {
        const newForm = await formRepository.addForm(req.body);
        // console.log(currentPerson);
        // if (currentPerson.rowCount === 0) {
        //     res.render('forms', {login: "", role: "", isRegistered: false});
        //     return;
        // }
        // res.render('forms', {login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
        //     isRegistered: true, logins: logins.rows, statuses: statuses.rows});
        // const currentPerson = await formRepository.getCurrentPerson();
        // if (currentPerson.rowCount === 0) {
        //     res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
        //     return;
        // }
        // res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
        //     isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
        await this.getForms;
    },
}