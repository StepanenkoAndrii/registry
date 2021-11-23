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
        return await db.query(`select login, role from persons where id = (select person_id from current_person)`);
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
}

module.exports = FormRepository;