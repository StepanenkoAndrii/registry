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

    async getAllLogs() {
        return await db.query(`select (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_usage_date, old_status_id, number, series, type, login from (select * from logs
        inner join (select id, number, series from forms) as forms on logs.form_id = forms.id
        inner join (select id, type from types) as types on logs.type_id = types.id
        inner join (select id, login from persons) as persons on logs.person_id = persons.id) as all_data`);
    };

    async getTypes() {
        return await db.query(`select * from types`);
    };

    async getFilteredLogs(date, login, type) {
        let boolDate = false;
        let boolType = false;

        if (date.toString().length === 0) boolDate = true;
        if (type.toString().length === 0) boolType = true;

        return await db.query(`select * from 
        (select (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_usage_date, old_status_id, 
        number, series, type, login from (select * from logs
        inner join (select id, number, series from forms) as forms on logs.form_id = forms.id
        inner join (select id, type from types) as types on logs.type_id = types.id
        inner join (select id, login from persons) as persons on logs.person_id = persons.id) as all_data) as a
        where ((${boolDate} or date = '${date.toString()}')
        and (login like '%${login.toString()}%')
        and (${boolType} or (type = '${type}')))`);
    };

    async deleteForm(id) {
        await db.query(`delete from logs where (form_id = ${id})`);
        return await db.query(`delete from forms where (id = ${id})`);
    };

    async getLogById(id) {
        return await db.query(`select * from 
        (select (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_usage_date, old_status_id,
        (select name from persons where (id = 2)) as old_name, (select surname from persons where (id = 2)) as old_surname, 
        (select middle_name from persons where (id = 2)) as old_middle_name, (select status from form_statuses where (id = 1)) as old_status, 
        (select name from persons where (id in (select person_id from forms where id = 11))) as name,
        (select surname from persons where (id in (select person_id from forms where id = 11))) as surname,
        (select middle_name from persons where (id in (select person_id from forms where id = 11))) as middle_name,
        number, series, type, login from (select * from logs
        inner join (select id, number, series from forms) as forms on logs.form_id = forms.id
        inner join (select id, type from types) as types on logs.type_id = types.id
        inner join (select id, login from persons) as persons on logs.person_id = persons.id) as all_data) as a`);
    }
}

module.exports = FormRepository;