const db = require('../db');
const moment = require('moment');

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
            `(name ilike '%${name.toString()}%') and \n` +
            `(surname ilike '%${surname.toString()}%') and \n` +
            `(middle_name ilike '%${middle_name.toString()}%')\n` +
            `)\n` +
            `)) and\n` +
            `(${boolStatus} or (status_id in (\n` +
            `select id from form_statuses where (status = '${status}')\n` +
            `)))\n` +
            `)`);
    };

    async getFormById(id) {
        return await db.query(`select forms.id, number, series, to_char(usage_date, 'YYYY-MM-DD') as usage_date, name, 
        surname, middle_name, login, status from 
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
        await db.query(`insert into forms(number, series, usage_date, person_id, status_id) values (${formData.number}, 
        ${formData.series}, null, (select id from persons where (login = '${formData.login.toString()}')),
        (select id from form_statuses where (status = '${formData.status.toString()}'))
        )`);
        return db.query(`select id, number, series, to_char(usage_date, 'YYYY-MM-DD') as usage_date, person_id, status_id
        from forms order by id desc limit 1`);
    };

    async editForm(formData, id) {
        const usage_date = (formData.usage_date !== null && formData.usage_date !== undefined && formData.usage_date.toString() !== "") ? formData.usage_date.toString() : null;
        const old_usage_date = (formData.old_usage_date !== null && formData.old_usage_date !== undefined && formData.old_usage_date.toString() !== "") ? formData.old_usage_date.toString() : null;

        if (usage_date === null) {
            await db.query(`update forms set number = ${formData.number}, series = ${formData.series}, usage_date = null,
            person_id = (select id from persons where (login = '${formData.login.toString()}')),
            status_id = (select id from form_statuses where (status = '${formData.status.toString()}')) where (id = ${id})`);
        }
        else {
            await db.query(`update forms set number = ${formData.number}, series = ${formData.series}, usage_date = '${usage_date}',
            person_id = (select id from persons where (login = '${formData.login.toString()}')),
            status_id = (select id from form_statuses where (status = '${formData.status.toString()}')) where (id = ${id})`);
        }

        if (old_usage_date === null) {
            await db.query(`create table temp as (select id, number, series, usage_date, person_id, status_id from forms where (id = ${id}));
            alter table temp add column temp_id serial primary key, add column old_number int, add column old_series int, add column old_usage_date date, add column old_status text,
            add column old_login text, add column update_date date;
            update temp set old_number = ${formData.old_number}, old_series = ${formData.old_series}, old_usage_date = null,
            old_status = '${formData.old_status.toString()}', old_login = '${formData.old_login.toString()}', update_date = '${moment().format('L').toString()}'`);
        }
        else {
            await db.query(`create table temp as (select id, number, series, usage_date, person_id, status_id from forms where (id = ${id}));
            alter table temp add column temp_id serial primary key, add column old_number int, add column old_series int, add column old_usage_date date, add column old_status text,
            add column old_login text, add column update_date date;
            update temp set old_number = ${formData.old_number}, old_series = ${formData.old_series}, old_usage_date = '${old_usage_date}',
            old_status = '${formData.old_status.toString()}', old_login = '${formData.old_login.toString()}', update_date = '${moment().format('L').toString()}'`);
        }

        const temp = await db.query(`select * from temp`);

        return await db.query(`select id, number, series, to_char(usage_date, 'YYYY-MM-DD') as usage_date, person_id, status_id,
        old_number, old_series, to_char(old_usage_date, 'YYYY-MM-DD') as old_usage_date, old_status, old_login, to_char(update_date, 'YYYY-MM-DD') as update_date from temp where (temp_id = ${temp.rows[0].temp_id})`);
    };

    async editLogForm(formData, id) {
        const old_usage_date = (formData.old_usage_date !== null && formData.old_usage_date !== undefined && formData.old_usage_date.toString() !== "") ? formData.old_usage_date.toString() : null;

        if (old_usage_date === null) {
            return await db.query(`update forms set number = ${formData.old_number}, series = ${formData.old_series}, 
            usage_date = null, person_id = '${formData.old_person_id}',
            status_id = ${formData.old_status_id} where (id = ${id})`);
        }
        else {
            return await db.query(`update forms set number = ${formData.old_number}, series = ${formData.old_series}, 
            usage_date = '${old_usage_date}', person_id = '${formData.old_person_id}',
            status_id = ${formData.old_status_id} where (id = ${id})`);
        }

    };

    async getUserById(id) {
        return await db.query(`select id, name, surname, middle_name, to_char(birth_date, 'YYYY-MM-DD') as birth_date, role, is_active from persons where (id = ${id})`);
    };

    async getRegistrators() {
        return await db.query(`select * from persons where (role = 'Реєстратор')`);
    };

    async getFilteredRegistrators(data) {
        return await db.query(`select * from persons where ((role = 'Реєстратор') and (login ilike '%${data.login.toString()}%') and 
		(name ilike '%${data.name.toString()}%') and (surname ilike '%${data.surname.toString()}%') and 
		(middle_name ilike '%${data.middle_name.toString()}%') and (email ilike '%${data.email.toString()}%'))`);
    };

    async activateRegistrator(id) {
        return await db.query(`update persons set is_active = true where (id = ${id})`);
    };

    async deactivateRegistrator(id) {
        return await db.query(`update persons set is_active = false where (id = ${id})`);
    };

    async getAllLogs() {
        return await db.query(`select id, idc, (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, 
        old_number, old_series, old_usage_date, old_status_id, number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from forms) as forms on logs.form_id = forms.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data order by date desc`);
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
        (select id, idc, (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, old_number, old_series, old_usage_date, old_status_id, 
        number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from forms) as forms on logs.form_id = forms.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data) as a
        where ((${boolDate} or date = '${date.toString()}')
        and (login ilike '%${login.toString()}%')
        and (${boolType} or (type = '${type}')))`);
    };

    async deleteForm(id) {
        await db.query(`delete from logs where (form_id = ${id})`);
        return await db.query(`delete from forms where (id = ${id})`);
    };

    async getDataByLogId(id) {
        return await db.query(`select * from 
        (select id, idc, (type_id = 2) as is_edited, form_id, to_char(date, 'YYYY-MM-DD') as date, 
        (select to_char(usage_date, 'YYYY-MM-DD') as usage_date from forms where (id = form_id)), old_number, old_series, 
        to_char(old_usage_date, 'YYYY-MM-DD') as old_usage_date, old_status_id, old_person_id,
        (select name from persons where (id = old_person_id)) as old_name, (select surname from persons where (id = old_person_id)) as old_surname, 
        (select middle_name from persons where (id = old_person_id)) as old_middle_name, (select status from form_statuses where (id = old_status_id)) as old_status, 
        (select name from persons where (id in (select person_id from forms where id = form_id))) as name,
        (select surname from persons where (id in (select person_id from forms where id = form_id))) as surname,
        (select middle_name from persons where (id in (select person_id from forms where id = form_id))) as middle_name,
        (select status from form_statuses where (id = (select status_id from forms where (id = form_id)))) as status,
        number, series, type, login from (select * from logs
        inner join (select id as ida, number, series from forms) as forms on logs.form_id = forms.ida
        inner join (select id as idb, type from types) as types on logs.type_id = types.idb
        inner join (select id as idc, login from persons) as persons on logs.person_id = persons.idc) as all_data) as a
        where id = ${id}`);
    };

    async addCreationLog(data) {
        return await db.query(`insert into logs (type_id, form_id, person_id, date, old_number, old_series, old_usage_date, old_status_id, old_person_id) 
        values (1, ${data.id}, ${data.person_id}, null, null, null, null, null, null)`);
    };

    async addUpdateLog(data) {
        const old_usage_date = (data.old_usage_date !== null && data.old_usage_date !== undefined) ? data.old_usage_date.toString() : null;

        if (old_usage_date === null) {
            await db.query(`insert into logs (type_id, form_id, person_id, date, old_number, old_series, old_usage_date, old_status_id, old_person_id) 
            values (2, ${data.id}, ${data.person_id}, '${data.update_date.toString()}', ${data.old_number}, ${data.old_series}, null, 
            (select id from form_statuses where (status = '${data.old_status.toString()}')), 
            (select id from persons where (login = '${data.old_login.toString()}')))`);
        }
        else {
            await db.query(`insert into logs (type_id, form_id, person_id, date, old_number, old_series, old_usage_date, old_status_id, old_person_id) 
            values (2, ${data.id}, ${data.person_id}, '${data.update_date.toString()}', ${data.old_number}, ${data.old_series}, '${old_usage_date}', 
            (select id from form_statuses where (status = '${data.old_status.toString()}')), 
            (select id from persons where (login = '${data.old_login.toString()}')))`);
        }

        return await db.query(`drop table temp`);
    };
}

module.exports = FormRepository;