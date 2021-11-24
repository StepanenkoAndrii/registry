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

    async getEditFormById(req, res) {
        const form = await formRepository.getFormById(req.params.id);
        const logins = await formRepository.getLogins();
        const statuses = await formRepository.getStatuses();
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('editForm', {form: form.rows[0], login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('editForm', {form: form.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", logins: logins.rows, statuses: statuses.rows});
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
        // await this.getForms;
        if (!newForm) return;
        const forms = await formRepository.getForms();
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async updateForm(req, res) {
        const updatedForm = await formRepository.editForm(req.body, req.params.id);
        const form = await formRepository.getFormById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('form', {form: form.rows[0], login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('form', {form: form.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getUserById(req, res) {
        const user = await formRepository.getUserById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        // if (currentPerson.rowCount === 0) {
        //     res.render('form', {form: form.rows[0], login: "", role: "", isRegistrator: false});
        //     return;
        // }
        res.render('adminPage', {user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },
}