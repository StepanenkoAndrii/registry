const FormRepository = require('../repositories/FormRepository');
const formRepository = new FormRepository();

module.exports = {
    async getForms(req, res) {
        const forms = await formRepository.getForms();
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
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
        res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async getFormById(req, res) {
        const form = await formRepository.getFormById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('form', {form: form.rows[0], login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('form', {form: form.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", visible: false, date: form.rows[0].usage_date !== null ? form.rows[0].usage_date : "Бланк ще не використано"});
    },

    async getEditFormById(req, res) {
        const form = await formRepository.getFormById(req.params.id);
        const statuses = await formRepository.getStatuses();
        const currentPerson = await formRepository.getCurrentPerson();
        console.log(form.rows[0]);
        res.render('editForm', {form: form.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", statuses: statuses.rows, old_date_exists: form.rows[0].usage_date !== null, form_login: form.rows[0].login});
    },

    async getHomePage(req, res) {
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('home', {login: "", role: ""});
            return;
        }
        res.render('home', {login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id});
    },

    async getFormsData(req, res) {
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('newForm', {login: currentPerson.rows[0].login});
    },

    async addForm(req, res) {
        const newForm = await formRepository.addForm(req.body);
        // await this.getForms;
        if (!newForm) return;
        const log = await formRepository.addCreationLog(newForm.rows[0]);
        const forms = await formRepository.getForms();
        const currentPerson = await formRepository.getCurrentPerson();
        if (currentPerson.rowCount === 0) {
            res.render('forms', {forms: forms.rows, login: "", role: "", isRegistrator: false});
            return;
        }
        res.render('forms', {forms: forms.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async updateForm(req, res) {
        const updatedForm = await formRepository.editForm(req.body, req.params.id);
        const log = await formRepository.addUpdateLog(updatedForm.rows[0]);
        const form = await formRepository.getFormById(req.params.id);
        res.redirect(`/forms/${form.rows[0].id}`);
    },

    async getUserById(req, res) {
        const user = await formRepository.getUserById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('profilePage', {user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", isRegOnPage: user.rows[0].role === "Реєстратор", view: false});
    },

    async getRegistrators(req, res) {
        const registrators = await formRepository.getRegistrators();
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('registrators', {registrators: registrators.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор"});
    },

    async viewRegistrator(req, res) {
        const user = await formRepository.getUserById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('profilePage', {user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", isRegOnPage: user.rows[0].role === "Реєстратор", view: true});
    },

    async activateRegistrator(req, res) {
        const activatedRegistrator = await formRepository.activateRegistrator(req.params.id);
        const user = await formRepository.getUserById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('profilePage', {user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", isRegOnPage: user.rows[0].role === "Реєстратор", view: true});
    },

    async deactivateRegistrator(req, res) {
        const deactivatedRegistrator = await formRepository.deactivateRegistrator(req.params.id);
        const user = await formRepository.getUserById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('profilePage', {user: user.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", isRegOnPage: user.rows[0].role === "Реєстратор", view: true});
    },

    async getAllLogs(req, res) {
        const logs = await formRepository.getAllLogs();
        const types = await formRepository.getTypes();
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('logs', {logs: logs.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", types: types.rows, isEdited: false});
    },

    async getFilteredLogs(req, res) {
        const logs = await formRepository.getFilteredLogs(req.query.date, req.query.login, req.query.type);
        const types = await formRepository.getTypes();
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('logs', {logs: logs.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", types: types.rows});
    },

    async deactivateCreation(req, res) {
        const form = await formRepository.getFormById(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('form', {form: form.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", visible: true});
    },

    async deleteForm(req, res) {
        const deletedForm = await formRepository.deleteForm(req.params.id);
        const logs = await formRepository.getAllLogs();
        const types = await formRepository.getTypes();
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('logs', {logs: logs.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", types: types.rows});
    },

    async deactivateUpdate(req, res) {
        const data = await formRepository.getDataByLogId(req.params.id);
        const currentPerson = await formRepository.getCurrentPerson();
        console.log(data.rows[0]);
        res.render('declineUpdate', {data: data.rows[0], login: currentPerson.rows[0].login, role: currentPerson.rows[0].role, id: currentPerson.rows[0].id,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", new_date: data.rows[0].usage_date !== null ? data.rows[0].usage_date : "Бланк ще не використано",
            old_date: data.rows[0].old_usage_date !== null ? data.rows[0].old_usage_date : "Бланк ще не використано"});
    },

    async updateLogForm(req, res) {
        const updatedForm = await formRepository.editLogForm(req.body, req.params.id);
        const logs = await formRepository.getAllLogs();
        const types = await formRepository.getTypes();
        const currentPerson = await formRepository.getCurrentPerson();
        res.render('logs', {logs: logs.rows, login: currentPerson.rows[0].login, role: currentPerson.rows[0].role,
            isRegistrator: currentPerson.rows[0].role === "Реєстратор", types: types.rows});
    },
}