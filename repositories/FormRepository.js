const db = require('../db');

class FormRepository {
    async getForms() {
        return await db.query('select * from forms');
    };

    async getFilteredForms(usage_date, series, number, name, surname, middle_name, status) {
        let boolDate = false;
        let boolStatus = false;

        if (usage_date.toString().length === 0) boolDate = true;
        if (status.toString().length === 0) boolStatus = true;

        return await db.query(`select * from forms where (\n` +
            `(${boolDate} or to_char(usage_date, 'YYYY-MM-DD') = '${usage_date.toString()}') and \n` +
            `(cast(series as text) like '%${series.toString()}%') and \n` +
            `(cast(number as text) like '%${number.toString()}%') and \n` +
            `(person_id in (\n` +
            `select id from persons where (\n` +
            `(name like '%${name.toString()}%') and \n` +
            `(surname like '%${surname.toString()}%') and \n` +
            `(middle_name like '%${middle_name.toString()}%')\n` +
            `)\n` +
            `)) and\n` +
            `(${boolStatus} or (status_id in (\n` +
            `select id from form_statuses where (status = '${status}')\n` +
            `)))\n` +
            `)`);
    };

    async getFormById(id) {
        return await db.query(`select forms.id, number, series, to_char(usage_date, 'YYYY-MM-DD') as usage_date, name, 
        surname, middle_name, status from 
	    forms inner join persons on forms.person_id = persons.id 
	    inner join form_statuses on forms.status_id = form_statuses.id 
	    where forms.id = ${id}`);
    };

    async getCurrentPerson() {
        return await db.query(`select id, login, role from persons where id = (select person_id from current_person)`);
    };

    async getLogins() {
        return await db.query(`select login from persons`);
    };

    async getStatuses() {
        return await db.query(`select status from form_statuses`);
    };

    async addForm(formData) {
        return await db.query(`insert into forms(number, series, usage_date, person_id, status_id) values (${formData.number}, 
        ${formData.series}, '${formData.usage_date.toString()}', (select id from persons where (login = '${formData.login.toString()}')),
        (select id from form_statuses where (status = '${formData.status.toString()}'))
        )`);
    };

    async editForm(formData, id) {
        return await db.query(`update forms set number = ${formData.number}, series = ${formData.series}, usage_date = '${formData.usage_date.toString()}', 
        person_id = (select id from persons where (login = '${formData.login.toString()}')),
        status_id = (select id from form_statuses where (status = '${formData.status.toString()}')) where (id = ${id})`);
    };

    async getUserById(id) {
        return await db.query(`select id, name, surname, middle_name, to_char(birth_date, 'YYYY-MM-DD') as birth_date, role, is_active from persons where (id = ${id})`);
    };

    async getRegistrators() {
        return await db.query(`select * from persons where (role = 'Реєстратор')`);
    };

    async activateRegistrator(id) {
        return await db.query(`update persons set is_active = true where (id = ${id})`);
    };

    async deactivateRegistrator(id) {
        return await db.query(`update persons set is_active = false where (id = ${id})`);
    };
}

module.exports = FormRepository;