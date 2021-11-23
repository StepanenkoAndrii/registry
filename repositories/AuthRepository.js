const db = require('../db');
const md5 = require('md5')

class AuthRepository {
    async getInstitutions() {
        return await db.query(`select * from institutions`);
    };

    async getPositions() {
        return await db.query(`select * from positions`);
    };

    async getIssues() {
        return await db.query(`select * from passport_authorities`);
    };

    async getAdmin(login) {
        return await db.query(`select count (distinct login) from persons where (role = 'Адміністратор' and login = '${login}')`);
    };

    async getUser(login) {
        return await db.query(`select count (distinct login) from persons where (login = '${login}')`);
    };

    async getUserWithPass(login, password) {
        return await db.query(`select count (distinct login) from persons where (login = '${login}' and password  = '${md5(password)}')`);
    };

    async addAdmin(adminData) {
        // console.log(adminData.passport_number, adminData.passport_series, adminData.passport_date, adminData.passport_issue, adminData.name, adminData.surname, adminData.middle_name, adminData.passport_number, adminData.birthdate, adminData.taxpayer_number, adminData.login, adminData.institution, adminData.position, adminData.email);
        return await db.query(`insert into passports (number, series, issue_date, issued_by) values (${adminData.passport_number}, ${adminData.series === undefined ? null : adminData.series}, '${adminData.passport_date.toString()}', (select id from passport_authorities where number = ${adminData.passport_issue}));
            insert into persons (
            name, surname, middle_name, passport_id, birth_date, taxpayer_number, login, password, institution_id, position_id, is_active, role, email_id
            ) values (
            '${adminData.name.toString()}', '${adminData.surname.toString()}', '${adminData.middle_name.toString()}', (select id from passports where number = '${adminData.passport_number.toString()}'), '${adminData.birthdate.toString()}', ${adminData.taxpayer_number}, 
            '${adminData.login.toString()}', '${md5(adminData.password).toString()}', (select id from institutions where name = '${adminData.institution.toString()}'), (select id from positions where name = '${adminData.position.toString()}'), 
            true, 'Адміністратор', (select id from emails where email = '${adminData.email.toString()}')
            )`
        );
    };

    async getErrorMessage(data, type) {
        if (type === 1) {
            console.log(data);
            let foundUsers = await this.getUser(data.login.toString());
            let foundUsersWithPass = await this.getUserWithPass(data.login.toString(), data.password.toString());
            if (foundUsers.rows[0].count === '0') {
                return "Помилка: Користувача з таким логіном не існує";
            }
            if (foundUsersWithPass.rows[0].count === '0') {
                return "Помилка: Невірний пароль";
            }
            return "";
        }
        else {
            let foundAdmins = await this.getAdmin(data.login.toString());
            if (foundAdmins.rows[0].count !== '0') {
                return "Помилка: адміністратор з таким логіном вже існує";
            }
            if (data.password !== data.password_confirmation) return "Помилка: паролі не співпадають";
            return "";
        }
    };

    async getLoginData(loginData) {
        return await db.query(`select id, role, login from persons where (login = '${loginData.login}' and password = '${md5(loginData.password)}')`);
    };

    async addCurrentPerson(personId) {
        return await db.query(`insert into current_person (person_id) values (${personId})`);
    };

    async deleteCurrentPerson() {
        return await db.query(`delete from current_person`);
    };
}

module.exports = AuthRepository;